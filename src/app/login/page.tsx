"use client"

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useAuth } from '@features'

type FormValues = {
  email: string
  password: string
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onTouched' })

  const router = useRouter()
  const { login, loading, user } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)

  // Redirect if already authenticated
  useEffect(() => {
    if (user) router.replace('/organizacao')
  }, [user, router])

  const onSubmit = async (data: FormValues) => {
    setServerError(null)
    try {
      await login({ email: data.email, password: data.password })
      router.push('/organizacao')
    } catch (err) {
      setServerError('Falha ao autenticar. Verifique suas credenciais.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md p-6 bg-card rounded-lg">
        <h1 className="text-2xl mb-4">Entrar</h1>

        <label className="block mb-2">Email</label>
        <input
          className="w-full mb-1 p-2 border rounded"
          {...register('email', { required: 'Email é obrigatório', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email inválido' } })}
          type="email"
        />
        {errors.email && <p className="text-destructive text-sm mb-2">{errors.email.message}</p>}

        <label className="block mb-2">Senha</label>
        <input
          className="w-full mb-1 p-2 border rounded"
          {...register('password', { required: 'Senha é obrigatória', minLength: { value: 6, message: 'Senha deve ter ao menos 6 caracteres' } })}
          type="password"
        />
        {errors.password && <p className="text-destructive text-sm mb-2">{errors.password.message}</p>}

        {serverError && <p className="text-destructive text-sm mb-2">{serverError}</p>}

        <button
          type="submit"
          className="w-full py-2 bg-primary text-white rounded disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
