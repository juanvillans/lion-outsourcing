export default function FuturisticButton({ children, onClick, ...props }) {
  console.log({props});
  return (
    <button type={props.type || "button"} className="button" onClick={onClick}>
      {children}
    </button>
  );
}
