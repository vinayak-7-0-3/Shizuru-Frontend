export default function Button({ children, color = "blue", type = "submit" }: {
  children: React.ReactNode,
  color?: string,
  type?: "submit" | "button"
}) {
  const bg = color === "green" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700";
  return (
    <button type={type} className={`w-full ${bg} p-3 rounded font-bold`}>
      {children}
    </button>
  );
}
