/**
 * Utility functions for displaying connection status consistently across components
 */

import { Icon } from "@iconify/react/dist/iconify.js";

/**
 * Get connection status icon
 * @param {boolean} connected - Whether the platform is connected
 * @param {object} options - Options for customization
 * @returns {JSX.Element} Connection status icon
 */
export const getConnectionStatusIcon = (connected, options = {}) => {
  const defaultOptions = {
    size: 'text-xl',
    connectedColor: 'text-success',
    disconnectedColor: 'text-danger',
    connectedIcon: 'solar:check-circle-bold',
    disconnectedIcon: 'solar:close-circle-bold'
  };

  const opts = { ...defaultOptions, ...options };

  return connected ? (
    <Icon 
      icon={opts.connectedIcon} 
      className={`${opts.connectedColor} ${opts.size}`} 
      title="Conectado"
    />
  ) : (
    <Icon 
      icon={opts.disconnectedIcon} 
      className={`${opts.disconnectedColor} ${opts.size}`} 
      title="Desconectado"
    />
  );
};

/**
 * Get connection status badge
 * @param {boolean} connected - Whether the platform is connected
 * @param {string} label - Platform label (e.g., 'Analytics', 'Google Ads')
 * @param {object} options - Options for customization
 * @returns {JSX.Element} Connection status badge
 */
export const getConnectionStatusBadge = (connected, label, options = {}) => {
  const defaultOptions = {
    showIcon: true,
    size: 'sm'
  };

  const opts = { ...defaultOptions, ...options };

  return connected ? (
    <span className="badge bg-success-subtle text-success-main">
      {opts.showIcon && <Icon icon="solar:check-circle-bold" className="me-1" />}
      {label}
    </span>
  ) : (
    <span className="badge bg-danger-subtle text-danger-main">
      {opts.showIcon && <Icon icon="solar:close-circle-bold" className="me-1" />}
      {label}
    </span>
  );
};

/**
 * Get connection status text
 * @param {boolean} connected - Whether the platform is connected
 * @param {object} options - Options for customization
 * @returns {string} Connection status text
 */
export const getConnectionStatusText = (connected, options = {}) => {
  const defaultOptions = {
    connectedText: 'Conectado',
    disconnectedText: 'Desconectado',
    locale: 'pt-BR'
  };

  const opts = { ...defaultOptions, ...options };

  return connected ? opts.connectedText : opts.disconnectedText;
};

/**
 * Format last sync date
 * @param {string|Date} lastSync - Last sync date
 * @param {object} options - Options for customization
 * @returns {string} Formatted date or "Não sincronizado"
 */
export const formatLastSync = (lastSync, options = {}) => {
  const defaultOptions = {
    locale: 'pt-BR',
    noSyncText: 'Não sincronizado',
    dateStyle: 'medium',
    timeStyle: 'short'
  };

  const opts = { ...defaultOptions, ...options };

  if (!lastSync) return opts.noSyncText;

  const date = new Date(lastSync);
  if (isNaN(date.getTime())) return opts.noSyncText;

  return date.toLocaleDateString(opts.locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) + ' ' + date.toLocaleTimeString(opts.locale, {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get all connection statuses for a client
 * @param {object} client - Client object from database
 * @returns {object} Connection statuses for all platforms
 */
export const getClientConnectionStatuses = (client) => {
  return {
    googleAnalytics: {
      connected: client.googleAnalytics?.connected || false,
      lastSync: client.googleAnalytics?.lastSync || null,
      label: 'Google Analytics'
    },
    googleAds: {
      connected: client.googleAds?.connected || false,
      lastSync: client.googleAds?.lastSync || null,
      label: 'Google Ads'
    },
    facebookAds: {
      connected: client.facebookAds?.connected || false,
      lastSync: client.facebookAds?.lastSync || null,
      label: 'Meta Ads'
    }
  };
};

/**
 * Get the most recent sync date from all platforms
 * @param {object} client - Client object from database
 * @returns {Date|null} Most recent sync date or null
 */
export const getLastSyncDate = (client) => {
  const dates = [
    client.googleAnalytics?.lastSync,
    client.googleAds?.lastSync,
    client.facebookAds?.lastSync
  ].filter(date => date);

  if (dates.length === 0) return null;

  // Return the most recent date
  return dates.reduce((latest, current) => {
    const currentDate = new Date(current);
    const latestDate = new Date(latest);
    return currentDate > latestDate ? current : latest;
  });
};

/**
 * Check if any platform is connected
 * @param {object} client - Client object from database
 * @returns {boolean} True if any platform is connected
 */
export const hasAnyConnection = (client) => {
  return Boolean(
    client.googleAnalytics?.connected ||
    client.googleAds?.connected ||
    client.facebookAds?.connected
  );
};

/**
 * Count connected platforms
 * @param {object} client - Client object from database
 * @returns {number} Number of connected platforms
 */
export const countConnectedPlatforms = (client) => {
  let count = 0;
  if (client.googleAnalytics?.connected) count++;
  if (client.googleAds?.connected) count++;
  if (client.facebookAds?.connected) count++;
  return count;
};