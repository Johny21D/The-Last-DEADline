import { useEffect, useState } from 'react'
import { supabase } from './supabase'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
    checkExistingSubscription()
  }, [])

  async function checkExistingSubscription() {
    if (!('serviceWorker' in navigator)) return
    const registration = await navigator.serviceWorker.getRegistration()
    const existing = await registration?.pushManager.getSubscription()
    setSubscribed(!!existing)
  }

  async function subscribe() {
    setLoading(true)
    setError(null)

    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        throw new Error('Push notifications are not supported in this browser.')
      }

      const permissionResult = await Notification.requestPermission()
      setPermission(permissionResult)

      if (permissionResult !== 'granted') {
        throw new Error('Notification permission was not granted.')
      }

      const registration = await navigator.serviceWorker.register('/sw.js')
      await navigator.serviceWorker.ready

      const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      })

      const { data: userData } = await supabase.auth.getUser()
      const userId = userData.user?.id
      if (!userId) throw new Error('You must be signed in.')

      const subJson = pushSubscription.toJSON()

      const { error: dbError } = await supabase.from('push_subscriptions').upsert(
        {
          user_id: userId,
          endpoint: subJson.endpoint!,
          p256dh: subJson.keys!.p256dh,
          auth_key: subJson.keys!.auth,
        },
        { onConflict: 'user_id,endpoint' }
      )

      if (dbError) throw new Error(dbError.message)

      setSubscribed(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  return { permission, subscribed, loading, error, subscribe }
}