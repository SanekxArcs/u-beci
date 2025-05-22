"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function AdminPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (username === process.env.NEXT_PUBLIC_ADMIN_USERNAME && password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      localStorage.setItem('isAuthenticated', 'true')
      router.push('/admin/dashboard')
    } else {
      setError('Invalid username or password')
    }
  }
  
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-280px)] px-4 py-8 mx-auto">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Logowanie administratora</CardTitle>
            <CardDescription className="text-center">
              Wprowadź dane logowania, aby uzyskać dostęp do panelu administracyjnego
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Błąd</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="username">Nazwa użytkownika</Label>
                <Input 
                  id="username" 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Hasło</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {/* <div className="text-xs text-muted-foreground">
                <p className="mt-2">Dane demo:</p>
                <p>Nazwa użytkownika: admin</p>
                <p>Hasło: password</p>
              </div> */}
            </CardContent>
            <CardFooter>
              <Button className="w-full mt-4" type="submit">
                <Lock className="mr-2 h-4 w-4" />
                Zaloguj się
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}