package com.reactnativeandroidsmsverification

import android.content.IntentFilter
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
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
          reactContext.getJSModule(RCTDeviceEventEmitter::class.java)
            .emit("onListenerStarted", "Listener started!")
        }

        task.addOnFailureListener {
          exception -> exception.printStackTrace()
        }
      } catch (e: Exception) {
        throw Exception("Failed to start listener: ${e.message}", e)
      }
    } else {
      throw Exception("Please register the receiver before starting it")
    }
  }

  private fun registerReceiver() {
    if (receiver == null || currentActivity == null) return

    try {
      currentActivity!!.registerReceiver(this.receiver, IntentFilter(SmsRetriever.SMS_RETRIEVED_ACTION))
      Log.d(this.name, "Receiver registered!")
      reactContext.getJSModule(RCTDeviceEventEmitter::class.java)
        .emit("onReceiverRegistered", "Broadcast Receiver registered!")
      isReceiverRegistered = true
    } catch (e: Exception) {
      throw Exception("Failed to register the receiver: ${e.message}", e)
    }
  }


  private fun unRegisterReceiver() {
    if (receiver == null || currentActivity == null || isReceiverRegistered) return

    try {
      currentActivity!!.unregisterReceiver(this.receiver)
      Log.d(this.name, "Receiver unRegistered!")
      reactContext.getJSModule(RCTDeviceEventEmitter::class.java)
        .emit("onReceiverUnregistered", "Broadcast Receiver unregistered!")
      isReceiverRegistered = false
    } catch (e: Exception) {
      throw Exception("Failed to unRegister the receiver: ${e.message}", e)
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

