<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ crypto?.symbol }}/USD</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="crypto-content" v-if="crypto">
      <div class="crypto-detail-header">
        <div class="crypto-price-header">
          <h2 class="crypto-title">{{ crypto.name }} ({{ crypto.symbol }})</h2>
          <div class="crypto-rank">#{{ crypto.rank }}</div>
          <div class="crypto-main-price">
            ${{ formatPrice(crypto.price_usd) }}
          </div>
          <div
            :class="[
              'crypto-price-change',
              Number(crypto.percent_change_24h) >= 0 ? 'positive' : 'negative',
            ]"
          >
            {{ crypto.percent_change_24h }}% (24h)
          </div>
        </div>
      </div>

      <div class="crypto-stats-grid">
        <div class="crypto-stat-card">
          <h3>Market Cap</h3>
          <p>${{ formatCompactNumber(crypto.market_cap_usd) }}</p>
        </div>
        <div class="crypto-stat-card">
          <h3>24h Volume</h3>
          <p>${{ formatCompactNumber(crypto.volume24) }}</p>
        </div>
        <div class="crypto-stat-card">
          <h3>Circulating Supply</h3>
          <p>{{ formatCompactNumber(crypto.csupply) }} {{ crypto.symbol }}</p>
        </div>
        <div class="crypto-stat-card">
          <h3>Max Supply</h3>
          <p>{{ formatCompactNumber(crypto.msupply) }} {{ crypto.symbol }}</p>
        </div>
      </div>

      <div class="crypto-container ion-padding">
        <h2>Price Statistics</h2>
        <div class="crypto-price-list">
          <div class="price-stat-row">
            <div class="price-stat-label">Price USD</div>
            <div class="price-stat-value">
              ${{ formatPrice(crypto.price_usd) }}
            </div>
          </div>
          <div class="price-stat-row">
            <div class="price-stat-label">Price BTC</div>
            <div class="price-stat-value">{{ crypto.price_btc }} BTC</div>
          </div>
          <div class="price-stat-row">
            <div class="price-stat-label">Trading Volume</div>
            <div class="price-stat-value">
              ${{ formatCompactNumber(crypto.volume24) }}
              <span class="volume-native"
                >({{ formatCompactNumber(crypto.volume24_native) }}
                {{ crypto.symbol }})</span
              >
            </div>
          </div>
        </div>
      </div>

      <div class="crypto-container ion-padding">
        <h2>Price Changes</h2>
        <div class="crypto-stats-grid">
          <div
            v-for="(change, period) in priceChanges"
            :key="period"
            class="crypto-stat-card"
          >
            <h3>{{ period }}</h3>
            <p :class="Number(change) >= 0 ? 'text-success' : 'text-danger'">
              {{ change }}%
            </p>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
} from "@ionic/vue";
import type { Crypto } from "@/types";

const route = useRoute();
const crypto = ref<Crypto | null>(null);

const formatPrice = (price: string) => {
  const num = Number(price);
  if (isNaN(num)) return "0.00";
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatCompactNumber = (value: string) => {
  const num = Number(value);
  if (isNaN(num)) return "0";

  const formatter = Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 2,
  });

  return formatter.format(num);
};

const priceChanges = computed(() => {
  if (!crypto.value) return {};
  return {
    "1h": crypto.value.percent_change_1h,
    "24h": crypto.value.percent_change_24h,
    "7d": crypto.value.percent_change_7d,
  };
});

onMounted(async () => {
  try {
    const response = await fetch(
      `https://api.coinlore.net/api/ticker/?id=${route.params.id}`
    );
    const data = await response.json();
    crypto.value = data[0]; // API returns an array with single item
  } catch (error) {
    console.error("Error fetching crypto data:", error);
  }
});
</script>

<style scoped>
.crypto-icon {
  font-size: 28px;
  margin-right: 8px;
}

.text-success {
  color: var(--price-up-color);
}

.text-danger {
  color: var(--price-down-color);
}

ion-content {
  --background: #f8f9fa;
}

ion-item {
  --background: #ffffff;
  --inner-padding-end: 16px;
  margin-bottom: 1px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

ion-label {
  margin: 16px 0;
}

ion-item h2 {
  font-weight: 600;
  color: #1a1a1a;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}

ion-item h3 {
  color: #666;
  margin: 8px 0 0 0;
}

ion-item .date {
  align-items: center;
  display: flex;
}

ion-item ion-icon {
  font-size: 32px;
  margin-right: 16px;
  color: #2196f3;
}

ion-item ion-note {
  font-size: 1rem;
  margin-right: 12px;
  font-weight: 600;
  color: #2196f3;
}

.ion-padding {
  background: #ffffff;
  margin-top: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

h1 {
  margin: 0 0 16px 0;
  font-weight: 600;
  font-size: 1.2rem;
  color: #1a1a1a;
}

ion-list {
  background: transparent;
}

ion-list ion-item {
  --background: transparent;
  --border-color: rgba(0, 0, 0, 0.05);
}

ion-item {
  --inner-padding-end: 0;
  --background: transparent;
}

ion-label {
  margin-top: 12px;
  margin-bottom: 12px;
}

ion-item h2 {
  font-weight: 600;

  /**
   * With larger font scales
   * the date/time should wrap to the next
   * line. However, there should be
   * space between the name and the date/time
   * if they can appear on the same line.
   */
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

ion-item .date {
  align-items: center;
  display: flex;
}

ion-item ion-icon {
  font-size: 42px;
  margin-right: 8px;
}

ion-item ion-note {
  font-size: 0.9375rem;
  margin-right: 12px;
  font-weight: normal;
}

h1 {
  margin: 0;
  font-weight: bold;
  font-size: 1.4rem;
}

p {
  line-height: 1.4;
}

.mt-4 {
  margin-top: 24px;
}

.crypto-container ion-list + h1 {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding-top: 24px;
}

.crypto-price-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.price-stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.price-stat-row:last-child {
  border-bottom: none;
}

.price-stat-label {
  color: var(--text-secondary);
  font-size: 14px;
}

.price-stat-value {
  font-weight: 600;
  font-size: 16px;
  color: var(--text-primary);
}

.volume-native {
  font-size: 14px;
  color: var(--text-secondary);
  margin-left: 8px;
}

.crypto-price-header {
  text-align: center;
  padding: 20px 16px;
}

.crypto-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.crypto-rank {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 4px 0;
}

.crypto-main-price {
  font-size: 40px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 16px 0 8px;
}

.crypto-price-change {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
}

.crypto-price-change.positive {
  background: rgba(38, 173, 117, 0.1);
  color: var(--price-up-color);
}

.crypto-price-change.negative {
  background: rgba(234, 57, 67, 0.1);
  color: var(--price-down-color);
}

/* Remove or comment out the old header styles */
.crypto-detail-header h1,
.crypto-detail-price {
  display: none;
}
</style>
