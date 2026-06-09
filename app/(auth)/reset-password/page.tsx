import { Suspense } from 'react'
import ResetForm from '@/components/auth/reset-form'

export default function ResetPasswordPage({ searchParams }: { searchParams?: { token?: string } }) {
  const token = searchParams?.token
  return (
    <Suspense fallback={<div /> }>
      <ResetForm token={token} />
    </Suspense>
  )
}