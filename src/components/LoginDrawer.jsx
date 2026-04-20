"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useLoading } from "@/context/LoadingContext";
import { MailCheck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function LoginDrawer({ open, onOpenChange, emailIntputRef }) {
  const [inputOTP, setInputOTP] = useState("");
  const [otpError, setOtpError] = useState(false);
  const { showLoading, hideLoading } = useLoading();

  const verificarCodigo = async () => {
    const email = emailIntputRef.current.value.trim();
    const codigoIngresado = inputOTP.trim();

    if (codigoIngresado.length !== 6) {
      toast.error("El código debe tener 6 dígitos", {
        description: "Por favor, ingresa un código válido de 6 dígitos.",
      });
      setOtpError(true);
      return;
    }

    showLoading("Verificando código");
    const checkCodeResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/verification_codes/comprobar-codigo/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({ email, code: codigoIngresado }),
      },
    );
    const checkCodeJSON = await checkCodeResponse.json();
    console.log("Respuesta de verificación de código:", checkCodeJSON);
    hideLoading();

    if (!checkCodeResponse.ok || !checkCodeJSON.isValid) {
      toast.error("Código de verificación inválido", {
        description:
          "El código que ingresaste no es correcto. Por favor, intenta de nuevo.",
      });
      setOtpError(true);
      return;
    }

    if (checkCodeJSON.error) {
      toast.error("Error al verificar el código", {
        description: checkCodeJSON.error || "Por favor, intenta de nuevo.",
      });
      setOtpError(true);
      return;
    }

    setOtpError(false);
    toast.success("Código verificado", {
      description:
        "Tu código ha sido verificado exitosamente. Iniciando sesión.",
    });

    window.location.href = "/dashboard";
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-zinc-950 text-white border-t border-zinc-800">
        <div className="mx-auto w-full max-w-sm pb-8">
          {/* Header */}
          <DrawerHeader className="pt-8 pb-4 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#006847]/20 ring-1 ring-[#006847]/40">
              <MailCheck className="h-7 w-7 text-[#00a86b]" />
            </div>
            <DrawerTitle className="text-xl font-semibold text-white">
              Verificación de identidad
            </DrawerTitle>
            <DrawerDescription className="mt-1.5 text-sm text-zinc-400">
              Ingresa el código de 6 dígitos que enviamos a tu correo
              electrónico.
            </DrawerDescription>
          </DrawerHeader>

          {/* OTP Input */}
          <div className="flex flex-col items-center gap-3 px-6 py-4">
            <InputOTP
              maxLength={6}
              value={inputOTP}
              onChange={(value) => {
                setInputOTP(value);
                setOtpError(false);
              }}
            >
              <InputOTPGroup>
                <InputOTPSlot
                  aria-invalid={otpError ? true : undefined}
                  index={0}
                  className="h-12 w-12 text-lg border-zinc-700 bg-zinc-900 text-white focus:border-[#006847] focus:ring-[#006847]"
                />
                <InputOTPSlot
                  aria-invalid={otpError ? true : undefined}
                  index={1}
                  className="h-12 w-12 text-lg border-zinc-700 bg-zinc-900 text-white"
                />
                <InputOTPSlot
                  aria-invalid={otpError ? true : undefined}
                  index={2}
                  className="h-12 w-12 text-lg border-zinc-700 bg-zinc-900 text-white"
                />
              </InputOTPGroup>
              <InputOTPSeparator className="text-zinc-600" />
              <InputOTPGroup>
                <InputOTPSlot
                  aria-invalid={otpError ? true : undefined}
                  index={3}
                  className="h-12 w-12 text-lg border-zinc-700 bg-zinc-900 text-white"
                />
                <InputOTPSlot
                  aria-invalid={otpError ? true : undefined}
                  index={4}
                  className="h-12 w-12 text-lg border-zinc-700 bg-zinc-900 text-white"
                />
                <InputOTPSlot
                  aria-invalid={otpError ? true : undefined}
                  index={5}
                  className="h-12 w-12 text-lg border-zinc-700 bg-zinc-900 text-white"
                />
              </InputOTPGroup>
            </InputOTP>

            <p className="text-xs text-zinc-500">
              ¿No recibiste el código?{" "}
              <button className="text-[#00a86b] hover:text-[#00c47e] underline underline-offset-2 transition-colors duration-150">
                Reenviar
              </button>
            </p>
          </div>

          {/* Footer */}
          <DrawerFooter className="px-6 pt-2 gap-2">
            <Button
              className="w-full bg-[#006847] hover:bg-[#00854e] text-white font-semibold transition-colors duration-200"
              onClick={verificarCodigo}
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Verificar código
            </Button>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                className="w-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors duration-200"
              >
                Cancelar
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
