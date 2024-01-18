'use server';

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      console.log('FORM DATA : ', formData)
      await signIn('credentials', formData);
    } catch (error) {
      console.log('error server act : ', error)
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }