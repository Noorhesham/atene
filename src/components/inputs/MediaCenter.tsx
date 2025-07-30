import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminEntityQuery, ApiMediaFile } from "@/hooks/useUsersQuery";
import { cn } from "@/lib/utils";
import {
  Upload,
  Image as ImageIcon,
  File,
  FileText,
  FileSpreadsheet,
  MessageSquare,
  Grid3X3,
  User,
  Search,
  Check,
  Loader2,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MediaCenterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (file: ApiMediaFile) => void;
  selectedFiles?: ApiMediaFile[];
  multiple?: boolean;
  acceptedTypes?: string[];
  trigger?: React.ReactNode;
}

const MEDIA_TYPES = [
  { value: "chat-files", label: "Chat Files", icon: MessageSquare },
  { value: "media", label: "Media", icon: File },
  { value: "pdf", label: "PDF", icon: FileText },
  { value: "excel", label: "Excel", icon: FileSpreadsheet },
  { value: "word", label: "Word", icon: FileText },
  { value: "gallery", label: "Gallery", icon: Grid3X3 },
  { value: "image", label: "Images", icon: ImageIcon },
  { value: "avatar", label: "Avatars", icon: User },
  { value: "thumbnail", label: "Thumbnails", icon: ImageIcon },
];

// Simple toast function - replace with your preferred toast implementation
const showToast = (message: string, type: "success" | "error" = "success") => {
  // Using browser notification for now - replace with your toast library
  if (type === "success") {
    console.log(`✅ ${message}`);
  } else {
    console.error(`❌ ${message}`);
  }

  // You can replace this with your preferred toast implementation like:
  // toast(message, { type });
};

export const MediaCenter: React.FC<MediaCenterProps> = ({
  open,
  onOpenChange,
  onSelect,
  selectedFiles = [],
  multiple = false,
  acceptedTypes = [],
  trigger,
}) => {
  const [activeTab, setActiveTab] = useState("gallery");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<ApiMediaFile[]>(selectedFiles);
  const [isUploading, setIsUploading] = useState(false);

  // Use the admin entity query for media files
  const {
    data: mediaFiles,
    isLoading,
    error,
    refetch,
  } = useAdminEntityQuery("media-center", {
    queryParams: { type: activeTab, search: searchQuery },
    enabled: open,
  });

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchQuery("");
  };

  // Handle file selection
  const handleFileSelect = (file: ApiMediaFile) => {
    if (multiple) {
      const isSelected = selectedItems.some((item) => item.id === file.id);
      if (isSelected) {
        setSelectedItems((prev) => prev.filter((item) => item.id !== file.id));
      } else {
        setSelectedItems((prev) => [...prev, file]);
      }
    } else {
      setSelectedItems([file]);
      onSelect(file);
      onOpenChange(false);
    }
  };

  // Handle multiple selection confirmation
  const handleConfirmSelection = () => {
    if (selectedItems.length > 0) {
      selectedItems.forEach((file) => onSelect(file));
      onOpenChange(false);
    }
  };

  // Simple file upload handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("file_type", activeTab);

        const response = await fetch(`https://aatene.com/api/add-new`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }
      }

      showToast(`Successfully uploaded ${files.length} file(s)`, "success");
      refetch(); // Revalidate the data
    } catch (error) {
      console.error("Upload error:", error);
      showToast("Failed to upload files", "error");
    } finally {
      setIsUploading(false);
      // Reset the input
      event.target.value = "";
    }
  };

  // Get file icon based on type
  const getFileIcon = (fileName: string, type: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    if (type === "image" || type === "gallery" || type === "avatar" || type === "thumbnail") {
      return ImageIcon;
    }

    switch (extension) {
      case "pdf":
        return FileText;
      case "xlsx":
      case "xls":
        return FileSpreadsheet;
      case "doc":
      case "docx":
        return FileText;
      default:
        return File;
    }
  };

  // Check if file is an image
  const isImageFile = (fileName: string, type: string) => {
    const imageTypes = ["image", "gallery", "avatar", "thumbnail"];
    if (imageTypes.includes(type)) return true;

    const extension = fileName.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || "");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="!min-w-[70vw] h-[90vh] flex p-0 gap-0">
        {/* Sidebar for Navigation */}
        <aside className="w-64 flex flex-col border-r bg-muted/40 p-4">
          <DialogHeader className="mb-4">
            <DialogTitle className="flex items-center gap-2">
              <Grid3X3 className="h-5 w-5" />
              Media Center
            </DialogTitle>
          </DialogHeader>

          <Button
            onClick={() => document.getElementById(`file-upload`)?.click()}
            disabled={isUploading}
            className="w-full mb-4"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload File"}
          </Button>

          <ScrollArea className="flex-1">
            <nav className="flex flex-col gap-1 pr-2">
              {MEDIA_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.value}
                    variant={activeTab === type.value ? "secondary" : "ghost"}
                    className="justify-start gap-2"
                    onClick={() => handleTabChange(type.value)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{type.label}</span>
                  </Button>
                );
              })}
            </nav>
          </ScrollArea>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            {/* Search Bar */}
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Hidden file input for the upload button */}
          <input
            type="file"
            id="file-upload"
            multiple
            accept={acceptedTypes.join(",")}
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
            aria-label="Upload files"
          />

          {/* Files Grid */}
          <ScrollArea className="flex-1 max-h-full overflow-hidden p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-destructive text-center">Error: {error}</div>
            ) : mediaFiles.length === 0 ? (
              <div className="text-center text-muted-foreground pt-10">
                <p className="font-semibold">No files found.</p>
                <p className="text-sm">Try uploading something!</p>
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] gap-4">
                {(mediaFiles as ApiMediaFile[]).map((file) => {
                  const isSelected = selectedItems.some((item) => item.id === file.id);
                  const isImage = isImageFile(file.file_name, activeTab);
                  const FileIcon = getFileIcon(file.file_name, activeTab);

                  return (
                    <Card
                      key={file.id}
                      className={cn(
                        "cursor-pointer transition-all duration-200 group relative overflow-hidden",
                        isSelected && "ring-2 ring-primary ring-offset-2"
                      )}
                      onClick={() => handleFileSelect(file)}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground rounded-full p-1 shadow-lg">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                      <CardContent className="p-0">
                        <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                          {isImage ? (
                            <img
                              src={file.src || file.url}
                              alt={file.title}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                          ) : (
                            <FileIcon className="h-10 w-10 text-muted-foreground" />
                          )}
                        </div>
                        <div className="p-2 text-xs">
                          <p className="font-semibold truncate" title={file.title}>
                            {file.title}
                          </p>
                          <div className="flex justify-between items-center text-muted-foreground mt-1">
                            <span>{(file.size / 1024).toFixed(1)}KB</span>
                            <Badge variant="outline">{file.file_type}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Action Footer */}
          {multiple && selectedItems.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t bg-background">
              <p className="text-sm font-medium">{selectedItems.length} item(s) selected</p>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setSelectedItems([])}>
                  Clear
                </Button>
                <Button onClick={handleConfirmSelection}>Confirm Selection</Button>
              </div>
            </div>
          )}
        </main>
      </DialogContent>
    </Dialog>
  );
};

export default MediaCenter;
