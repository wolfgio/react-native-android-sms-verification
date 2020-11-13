package com.reactnativeandroidsmsverification

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Bundle
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.google.android.gms.auth.api.phone.SmsRetriever
import com.google.android.gms.common.api.CommonStatusCodes
import com.google.android.gms.common.api.Status
import java.util.concurrent.TimeoutException


class AndroidSmsVerificationReceiver(private val reactContext: ReactApplicationContext) : BroadcastReceiver() {

  override fun onReceive(p0: Context?, intent: Intent?) {
    if (intent != null && SmsRetriever.SMS_RETRIEVED_ACTION == intent.action) {
        val extras: Bundle? = intent.extras
        val status: Status = extras?.get(SmsRetriever.EXTRA_STATUS) as Status
        when (status.statusCode) {
          CommonStatusCodes.SUCCESS -> {
            val message = extras[SmsRetriever.EXTRA_SMS_MESSAGE] as String

            reactContext.getJSModule(RCTDeviceEventEmitter::class.java)
              .emit("onMessageReceived", message)
          }

          CommonStatusCodes.TIMEOUT -> {
            reactContext.getJSModule(RCTDeviceEventEmitter::class.java)
              .emit("onReceiverTimeout", "Receiver timeout")
          }
        }
      }
  }
}
