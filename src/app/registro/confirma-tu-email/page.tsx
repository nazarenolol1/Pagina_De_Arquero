import Link from "next/link";

export default function ConfirmaTuEmailPage() {
  return (
    <main className="flex-1 flex flex-col justify-center px-6 py-16 md:px-16 max-w-lg">
      <h1 className="font-heading text-5xl md:text-6xl mb-4">
        Revisá tu email
      </h1>
      <p className="text-foreground/80">
        Te enviamos un correo con un link de confirmación. Hacé clic ahí para
        activar tu cuenta — todavía no vas a poder ingresar hasta
        confirmarlo.
      </p>
      <p className="text-foreground/60 text-sm mt-4">
        Si no lo ves, revisá la carpeta de spam o promociones.
      </p>
      <Link
        href="/login"
        className="underline underline-offset-2 mt-8 inline-block w-fit"
      >
        Ya confirmé, quiero ingresar
      </Link>
    </main>
  );
}
