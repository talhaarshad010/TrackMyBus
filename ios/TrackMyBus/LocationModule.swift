import Foundation
import CoreLocation
import React

@objc(LocationModule)
class LocationModule: RCTEventEmitter, CLLocationManagerDelegate {

  var locationManager: CLLocationManager!
  var hasListeners = false

  override init() {
    super.init()

    locationManager = CLLocationManager()
    locationManager.delegate = self
    locationManager.desiredAccuracy = kCLLocationAccuracyBest
    locationManager.distanceFilter = 10
    locationManager.allowsBackgroundLocationUpdates = true
    locationManager.pausesLocationUpdatesAutomatically = false
  }

  // =================================
  // REQUIRED
  // =================================
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }

  override func supportedEvents() -> [String]! {
    return ["onLocationUpdate"]
  }

  // =================================
  // START
  // =================================
  @objc
  func startTracking() {
    locationManager.requestAlwaysAuthorization()
    locationManager.startUpdatingLocation()
  }

  // =================================
  // STOP
  // =================================
  @objc
  func stopTracking() {
    locationManager.stopUpdatingLocation()
  }

  // =================================
  // LISTENERS
  // =================================
  override func startObserving() {
    hasListeners = true
  }

  override func stopObserving() {
    hasListeners = false
  }

  // =================================
  // LOCATION UPDATE
  // =================================
  func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {

    guard hasListeners else { return }
    guard let loc = locations.last else { return }

    sendEvent(
      withName: "onLocationUpdate",
      body: [
        "lat": loc.coordinate.latitude,
        "lng": loc.coordinate.longitude
      ]
    )
  }
}
