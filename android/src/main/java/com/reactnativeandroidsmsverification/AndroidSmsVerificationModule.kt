package com.reactnativeandroidsmsverification

import android.content.IntentFilter
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.android.gms.auth.api.phone.SmsRetriever
import com.google.android.gms.auth.api.phone.SmsRetrieverClient


class AndroidSmsVerificationModule : ReactContextBaseJavaModule, LifecycleEventListener {
  private val receiver: AndroidSmsVerificationReceiver?
  private val reactContext: ReactApplicationContext
  private val client: SmsRetrieverClient
  private var isReceiverRegistered: Boolean


  constructor(reactContext: ReactApplicationContext) : super(reactContext) {
    this.receiver = AndroidSmsVerificationReceiver(reactContext)
    this.isReceiverRegistered = false
    this.reactContext = reactContext
    this.client = SmsRetriever.getClient(reactContext)
    reactContext.addLifecycleEventListener(this)
  }

  override fun getName(): String {
      return "AndroidSmsVerification"
  }

  // Example method
  // See https://facebook.github.io/react-native/docs/native-modules-android
  @ReactMethod
  fun multiply(a: Int, b: Int, promise: Promise) {
    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit("onMessageReceived", "me mama")
    promise.resolve(a * b)
  }

  @ReactMethod
  fun registerBroadcastReceiver() {
    this.registerReceiver()
  }

  @ReactMethod
  fun unRegisterBroadcastReceiver() {
    this.unRegisterReceiver()
  }

  @ReactMethod
  fun startBroadcastReceiver() {
    if (isReceiverRegistered) {
      try {
        val task = client.startSmsRetriever();
        
        task.addOnSuccessListener {
          Log.d(this.name, "Listener started!")
        }

        task.addOnFailureListener {
          exception -> exception.printStackTrace()
        }
      } catch (e: Exception) {
        e.printStackTrace()
      }
    } else {
      throw error("Please register the broadcast receiver!")
    }
  }

  private fun registerReceiver() {
    if (receiver == null || currentActivity == null) return

    try {
      currentActivity!!.registerReceiver(this.receiver, IntentFilter(SmsRetriever.SMS_RETRIEVED_ACTION))
      Log.d(this.name, "Receiver registered!")
      isReceiverRegistered = true
    } catch (e: Exception) {
      e.printStackTrace()
    }
  }


  private fun unRegisterReceiver() {
    if (receiver == null || currentActivity == null || isReceiverRegistered) return

    try {
      currentActivity!!.unregisterReceiver(this.receiver)
      Log.d(this.name, "Receiver unRegistered!")
      isReceiverRegistered = false
    } catch (e: Exception) {
      e.printStackTrace()
    }
  }

  override fun onHostResume() {
    this.registerReceiver()
  }

  override fun onHostPause() {
    this.unRegisterReceiver()
  }

  override fun onHostDestroy() {
    this.unRegisterReceiver()
  }
}

