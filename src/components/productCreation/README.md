# Product Creation Form

A pixel-perfect multi-step form component for creating products with comprehensive validation and user-friendly interface.

## Features

- **Multi-step wizard** with progress indicator
- **RTL Arabic support** with proper layout
- **Comprehensive validation** using Zod schema
- **Responsive design** with modern UI components
- **Form persistence** across steps
- **Rich text editor** for product descriptions
- **Multi-select components** for colors, sizes, and tags
- **Date pickers** for scheduling
- **Image upload** for product photos
- **SEO optimization** fields

## Usage

```tsx
import { ProductCreationForm } from "@/components/productCreation";

function AddProductPage() {
  return (
    <div>
      <ProductCreationForm />
    </div>
  );
}
```

## Form Steps

### 1. Basic Information (المعلومات الأساسية)

- Product name in Arabic and English
- Category and brand selection
- SKU (unique product code)
- Short description

### 2. Product Details (تفاصيل المنتج)

- Rich text description
- Specifications (weight, dimensions, material)
- Color and size options using multi-select

### 3. Pricing & Inventory (التسعير والمخزون)

- Basic price, sale price, and cost
- Tax rate configuration
- Inventory tracking options
- Shipping settings

### 4. Advanced Settings (الإعدادات المتقدمة)

- Product images upload
- Publication settings and dates
- Sale period configuration
- SEO meta tags and keywords

## Components Used

- `FormInput` - Text inputs with validation
- `FormSelect` - Dropdown selections
- `CalendarInput` - Date picker
- `RichText` - WYSIWYG editor for descriptions
- `MultiSelect` - Multiple option selection
- `Progress` - Step progress indicator
- `Card` - Container component

## Validation

The form uses Zod schema validation with Arabic error messages. Each step is validated before proceeding to the next.

## Styling

- Uses Tailwind CSS for styling
- RTL layout with proper Arabic text alignment
- shadcn/ui components for consistent design
- Custom progress indicator
- Responsive grid layouts
