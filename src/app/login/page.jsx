"use client";
import React, { use, useRef, useState } from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import LoginDrawer from "@/components/LoginDrawer";
import { toast } from "sonner";
import { useLoading } from "@/context/LoadingContext";

export default function SparklesPreview() {
  const emailIntputRef = useRef(null);
  const { showLoading, hideLoading } = useLoading();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmitLoginForm = async (event) => {
    event.preventDefault();

    const email = emailIntputRef.current.value.trim();

    if (email === "") {
      toast.error("El correo electrónico es requerido", {
        description: "Por favor, ingresa tu correo electrónico para continuar.",
      });
      return;
    }

    showLoading("Comprobando Correo Electrónico");

    try {
      const responseCheckEmail = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/whitelist/check_email/?email=${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          mode: "cors",
        },
      );

      if (!responseCheckEmail.ok)
        throw new Error("Error al verificar el correo electrónico");

      const responseCheckEmailJson = await responseCheckEmail.json();

      const { isInWhiteList } = responseCheckEmailJson;

      if (!isInWhiteList) {
        toast.error("Correo electrónico no autorizado", {
          description:
            "Tu correo electrónico no está autorizado para iniciar sesión.",
        });
        hideLoading();
        return;
      }

      hideLoading();
    } catch (error) {
      toast.error("Error al verificar el correo electrónico", {
        description: "Por favor, intenta de nuevo.",
      });
    }

    showLoading("Enviando Código de Verificación");
    try {
      const sendVerificationCodeResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/send_verification_code/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          mode: "cors",
          body: JSON.stringify({ email }),
        },
      );

      if (!sendVerificationCodeResponse.ok)
        throw new Error("Error al enviar el correo de verificación");

      const sendVerificationCodeJSON =
        await sendVerificationCodeResponse.json();
      setEmailSent(true);
      const { mensaje } = sendVerificationCodeJSON;

      toast.success(mensaje, {
        description: "Te enviaremos un correo con un código de 6 dígitos.",
      });
      

      setDrawerOpen(true);
      hideLoading();
    } catch (error) {
      hideLoading();
      toast.error("Error al enviar el correo de verificación", {
        description: "Por favor, intenta de nuevo.",
      });
      setError(true);
      return;
    }
  };

  return (
    <div className="h-screen relative w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.5}
          maxSize={1.2}
          particleDensity={80}
          className="w-full h-full "
          particleColor={["#DAA520", "#006847", "#CE1126"]}
        />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="/anam_logo.png"
          className="mx-auto h-16 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Inicia Sesión
        </h2>
        <p className="mt-1 text-sm/6 text-gray-400 text-center">
          Bienvenido al Sistema de Continuidades
        </p>
      </div>

      <div className="relative z-10 mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmitLoginForm} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-100"
            >
              Correo Electrónico
            </label>
            <div className="mt-2">
              <input
                ref={emailIntputRef}
                id="email"
                name="email"
                placeholder="@anam.gob.mx"
                autoComplete="email"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-[#006847] sm:text-sm/6 border-[#00854e]"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-[#006847] px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-[#00854e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006847] transition-colors duration-200"
            >
              Iniciar Sesión
            </button>
            {emailSent && (
              <p
                className="mt-2 text-sm text-green-500 cursor-pointer text-center hover:text-green-600 transition-colors duration-200"
                onClick={() => setDrawerOpen(true)}
              >
                Te hemos enviado un correo con un código de 6 dígitos.
              </p>
            )}
            <LoginDrawer
              open={drawerOpen}
              error={error}
              onOpenChange={setDrawerOpen}
              emailIntputRef={emailIntputRef}
            />
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-400">
          No necesitas crear una cuenta para iniciar sesión. Basta con tu correo
          electrónico.{" "}
          <a
            href="/"
            className="font-semibold text-[#DAA520] hover:text-[#f0c040]"
          >
            Volver a la página de inicio
          </a>
        </p>
      </div>
    </div>
  );
}
