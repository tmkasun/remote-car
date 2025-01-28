import storage

print("Remounting filesystem as read-only false")
storage.remount("/", False)
storage.enable_usb_drive()