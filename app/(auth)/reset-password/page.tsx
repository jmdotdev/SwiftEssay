import ResetForm from '@/components/auth/reset-form'

export default function ResetPasswordPage({ searchParams }: { searchParams?: { token?: string } }) {
  const token = searchParams?.token
  return <ResetForm token={token} />
}
