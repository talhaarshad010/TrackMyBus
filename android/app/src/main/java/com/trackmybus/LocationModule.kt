package com.trackmybus

import android.content.Context
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.android.gms.location.*

class LocationModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  private val fusedClient =
    LocationServices.getFusedLocationProviderClient(reactContext)

  private var callback: LocationCallback? = null

  override fun getName() = "LocationModule"

  // =========================
  // START TRACKING
  // =========================
  @ReactMethod
fun startTracking() {

  val request = LocationRequest.Builder(
    Priority.PRIORITY_HIGH_ACCURACY,
    5000L
  )
    .setMinUpdateIntervalMillis(5000L) 
    .setMinUpdateDistanceMeters(3f)   
    .setWaitForAccurateLocation(true)
    .build()

  callback = object : LocationCallback() {
    override fun onLocationResult(result: LocationResult) {
      val loc = result.lastLocation ?: return

      val map = Arguments.createMap()
      map.putDouble("lat", loc.latitude)
      map.putDouble("lng", loc.longitude)
      map.putDouble("speed", loc.speed.toDouble())

      reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit("onLocationUpdate", map)
    }
  }

  fusedClient.requestLocationUpdates(request, callback!!, null)
}

  // =========================
  // STOP TRACKING
  // =========================
  @ReactMethod
  fun stopTracking() {
    callback?.let {
      fusedClient.removeLocationUpdates(it)
    }
    callback = null
  }
}
