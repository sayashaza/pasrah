"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOAuthLogin = async (provider: any) => {
    try {
      setLoading(true);
      setError('');
      const userCredential = await signInWithPopup(auth, provider);
      
      const userRef = doc(db, 'users', userCredential.user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: userCredential.user.email,
          name: userCredential.user.displayName || 'Admin',
          role: 'user',
          createdAt: new Date().toISOString()
        });
      }

      const token = await userCredential.user.getIdToken();
      
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify({
        id: userCredential.user.uid,
        email: userCredential.user.email,
        name: userCredential.user.displayName || 'Admin'
      }));
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      
      const userRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userRef, {
        email: userCredential.user.email,
        name: name || 'Admin',
        role: 'user',
        createdAt: new Date().toISOString()
      }, { merge: true });

      const token = await userCredential.user.getIdToken();
      
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify({
        id: userCredential.user.uid,
        email: userCredential.user.email,
        name: name || 'Admin'
      }));
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create new admin</CardTitle>
        <CardDescription className="text-center">
          Register new credentials to access the admin portal
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <div className="text-destructive text-sm font-medium text-center bg-destructive/10 p-2 rounded">{error}</div>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or register with</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button type="button" variant="outline" onClick={() => handleOAuthLogin(new GoogleAuthProvider())} disabled={loading}>
            Google
          </Button>
          <Button type="button" variant="outline" onClick={() => handleOAuthLogin(new FacebookAuthProvider())} disabled={loading}>
            Facebook
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-center w-full text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
