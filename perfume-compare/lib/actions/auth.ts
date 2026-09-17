"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const RegisterSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  email: z.email("Adresse email invalide."),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
});

export type RegisterResult = { error: string } | { success: true };

export async function registerUser(
  formData: FormData,
): Promise<RegisterResult> {
  // Honeypot: a field real users never see or fill. Bots that blindly fill
  // every input trip it. Fail silently (generic error) rather than telling
  // the bot exactly what gave it away.
  if (formData.get("website")) {
    return { error: "Une erreur est survenue. Veuillez réessayer." };
  }

  // Bots that submit instantly (no time to render/fill the form) get caught
  // here; genuine users take at least a couple of seconds.
  const renderedAt = Number(formData.get("renderedAt"));
  if (Number.isFinite(renderedAt) && Date.now() - renderedAt < 1500) {
    return { error: "Une erreur est survenue. Veuillez réessayer." };
  }

  const parsed = RegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Un compte existe déjà avec cet email." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  return { success: true };
}
