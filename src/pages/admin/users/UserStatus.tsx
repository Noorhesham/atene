export const UserStatusIndicator = ({ status }) => {
  const config = {
    active: { text: "مفعل", color: "text-green-600 bg-green-50" },
    pending: { text: "قيد الإنتظار", color: "text-orange-600 bg-orange-50" },
  };
  // Simple logic to alternate status for demo
  const currentStatus = status === 1 ? config.active : config.pending;

  return (
    <div className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1.5 ${currentStatus.color}`}>
      <div className={`w-2 h-2 rounded-full ${currentStatus.color.replace("text-", "bg-")}`}></div>
      {currentStatus.text}
    </div>
  );
};
export const UserList = ({ users, selectedUser, onSelectUser }) => (
  <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
    <div className="p-4 border-b border-gray-200">
      <div className="relative w-full">
        <Input
          type="text"
          placeholder="ابحث باسم الموظف او رقم الهاتف"
          className="w-full bg-gray-50 py-2.5 pr-10 pl-4 border-gray-300 rounded-lg"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
          <Search size={20} />
        </div>
      </div>
    </div>
    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
      <h3 className="font-bold text-gray-800">بيانات الموظف</h3>
      <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100">
        <ListFilter size={20} /> ترتيب
      </Button>
    </div>
    <div className="flex-grow overflow-y-auto p-2 space-y-2">
      {users.map((user) => {
        const isSelected = selectedUser?.id === user.id;
        const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email.split("@")[0];
        return (
          <div
            key={user.id}
            onClick={() => onSelectUser(user)}
            className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 ${
              isSelected ? "bg-blue-50" : "hover:bg-gray-50"
            }`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              readOnly
              className="form-checkbox h-5 w-5 text-main rounded border-gray-300 focus:ring-main"
            />
            <img src={user.avatar_url} alt={fullName} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex-grow">
              <p className="font-bold text-gray-800">{fullName}</p>
              <p className="text-sm text-gray-500">{user.roles[0]?.name || "موظف"}</p>
            </div>
            <UserStatusIndicator status={user.is_active} />
          </div>
        );
      })}
    </div>
  </div>
);
export default UserList;


