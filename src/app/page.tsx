import Link from "next/link";
import { Button } from "@/shared/components/Button";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col justify-center px-6 md:px-16 py-16 max-w-4xl">
      <p className="text-accent-secondary font-medium mb-4">
        Para arqueros y entrenadores
      </p>
      <h1 className="font-heading text-6xl md:text-8xl">
        Cada entrenamiento,
        <br />
        registrado.
      </h1>
      <p className="text-lg text-foreground/80 mt-6 max-w-md">
        Tu entrenador sube el video, la foto o la nota de cada clase. Vos ves
        tu progreso y tus estadísticas en un solo lugar.
      </p>
      <div className="flex gap-4 mt-10">
        <Link href="/registro">
          <Button>Crear cuenta</Button>
        </Link>
        <Link href="/login">
          <Button variant="secondary">Ingresar</Button>
        </Link>
      </div>
    </main>
  );
}
