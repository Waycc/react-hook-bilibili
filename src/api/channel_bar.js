import { get } from './fetch'
import { CHANNEL_URL } from "./url";

export function fetchChannelBar() {
  return get(CHANNEL_URL)
}
