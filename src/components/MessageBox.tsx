type MessageBoxProps = {
  type: "success" | "error" | "info";
  message: string | null;
};


export function MessageBox({ type, message }: MessageBoxProps) {
  if(!message) {
    return null;
  }
  
  let baseStyle = "w-full p-2 rounded border text-sm font-medium";
  
  let style = 
  type === "error" 
  ? "text-red-700 bg-red-100  border-red-400" 
  : "text-green-700 bg-green-100 border-green-400";
  
  return (
    <section className={`${baseStyle} ${style}`}>
      {message}
    </section>
    );
}
