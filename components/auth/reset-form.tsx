"use client"

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Eye, EyeOff, PenTool } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations'

export default function ResetForm({ token }: { token?: string | null }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const searchParams = useSearchParams()
  const urlToken = searchParams?.get('token') ?? null

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setError(null)
      const activeToken = token ?? urlToken
      if (!activeToken) throw new Error('Missing token')
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: activeToken, password: data.password }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.message || 'Failed to reset password')
      }
      setIsSubmitted(true)
    } catch (err: any) {
      setError(err?.message || 'An error occurred')
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-muted/30">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <PenTool className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">Swift Essay</span>
        </div>

        <Card>
          <CardHeader className="text-center">
            {isSubmitted ? (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 mb-4">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle className="text-2xl font-bold">Password reset</CardTitle>
                <CardDescription>
                  Your password has been successfully reset. Click below to log in.
                </CardDescription>
              </>
            ) : (
              <>
                <CardTitle className="text-2xl font-bold">Set new password</CardTitle>
                <CardDescription>
                  Your new password must be at least 8 characters long.
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <Button asChild className="w-full">
                <Link href="/login">Continue to login</Link>
              </Button>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {error && (
                    <div className="text-sm text-red-600">{error}</div>
                  )}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Enter new password"
                              autoComplete="new-password"
                              className="pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="Confirm new password"
                              autoComplete="new-password"
                              className="pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Resetting...' : 'Reset password'}
                  </Button>
                  <Button variant="ghost" asChild className="w-full">
                    <Link href="/login">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to login
                    </Link>
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
