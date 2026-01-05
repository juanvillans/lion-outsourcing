
export default function Footer() {
  return (
    <footer className="flex gap-1 py-5 flex-col md:flex-row items-center px-10 justify-center text-dark text-sm z-40 w-full mt-20 ">
      <p className="text-xs text-center text-gray-600">
        &copy; {new Date().getFullYear()} Lion PR Services. Todos los derechos
        reservados.
      </p>
    </footer>
    );
}
