pub use cap_cli_install::CliInstallStatus;

#[tauri::command]
#[specta::specta]
pub fn get_cli_install_status() -> Result<CliInstallStatus, String> {
    Err("The standalone cloud CLI is not included in Hi-Ha Record".into())
}

#[tauri::command]
#[specta::specta]
pub fn install_cli() -> Result<CliInstallStatus, String> {
    Err("The standalone cloud CLI is not included in Hi-Ha Record".into())
}

#[tauri::command]
#[specta::specta]
pub fn uninstall_cli() -> Result<CliInstallStatus, String> {
    Err("Hi-Ha Record does not manage another application’s CLI".into())
}
