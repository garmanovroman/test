export const defaultConfig = {
  common: {
    base_url: window.location.origin,
    base_url_remote: window.location.origin,
    server_api_endpoint: window.location.origin + '/rest/api/',
    server_api_chathub: window.location.origin,
    identity: window.location.origin,
  },
  auth: {
    authority: window.location.origin + '/identity',
    client_id: 'web-business-app',
    response_type: 'code',
    scope: 'openid profile web_api offline_access',
    refresh_time_before_tokens_expiration_in_second: 70,
    automaticSilentRenew: true,
    redirect_uri: window.location.origin + '/callback.html',
    silent_redirect_uri: window.location.origin + '/updatetoken.html',
    post_logout_redirect_uri: window.location.origin + '/',
  },
};

class GlobalConfig {
  config = defaultConfig;
  notDefinedYet = true;

  get() {
    if (this.notDefinedYet) {
      throw new Error(
        'Global config has not been defined yet. Be sure to call the getter only after the config has been downloaded and set. Probable cause is accessing globalConfig in static context.',
      );
    } else {
      return this.config;
    }
  }

  set(value) {
    if (this.notDefinedYet) {
      this.config = value;
      this.notDefinedYet = false;
    } else {
      throw new Error(
        'Global config has already been defined and now has been called second time. This is probably not intended.',
      );
    }
  }
}

export const globalConfig = new GlobalConfig();

export const globalConfigUrl = 'config.json';
