<template>
  <ion-item
    v-if="crypto"
    :routerLink="'/crypto/' + crypto.id"
    :detail="false"
    class="crypto-list-item"
  >
    <div class="crypto-item-container">
      <div class="crypto-main-info">
        <div class="crypto-rank">{{ crypto.rank }}</div>
        <div class="crypto-name-section">
          <h2>{{ crypto.name }}</h2>
          <span class="crypto-symbol">{{ crypto.symbol }}</span>
        </div>
      </div>

      <div class="crypto-price-info">
        <div class="price">${{ formatPrice(crypto.price_usd) }}</div>
        <div
          :class="[
            'change-pill',
            Number(crypto.percent_change_24h) >= 0 ? 'positive' : 'negative',
          ]"
        >
          {{ Number(crypto.percent_change_24h) >= 0 ? "↑" : "↓" }}
          {{ Math.abs(Number(crypto.percent_change_24h)).toFixed(1) }}%
        </div>
      </div>

      <div class="crypto-market-info">
        <div class="market-row">
          <div class="value">
            ${{ formatCompactNumber(crypto.market_cap_usd) }}
          </div>
          <div class="label">MCap</div>
        </div>
        <div class="market-row">
          <div class="value">${{ formatCompactNumber(crypto.volume24) }}</div>
          <div class="label">Vol</div>
        </div>
      </div>
    </div>
  </ion-item>
</template>

<script setup lang="ts">
import { IonItem } from "@ionic/vue";
import type { Crypto } from "@/types";

defineProps<{
  crypto: Crypto;
}>();

const formatPrice = (price: string) => {
  return Number(price).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatCompactNumber = (number: string) => {
  if (number === "0") return "Unlimited";
  return Number(number).toLocaleString(undefined, {
    notation: "compact",
    compactDisplay: "short",
  });
};
</script>

<style scoped>
.crypto-item-container {
  display: grid;
  grid-template-columns: 2.5fr 1.5fr 2fr;
  gap: 12px;
  width: 100%;
  align-items: center;
  padding: 8px 0;
}

.crypto-main-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.crypto-rank {
  color: var(--text-secondary);
  font-size: 14px;
  min-width: 24px;
}

.crypto-name-section {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.crypto-name-section h2 {
  font-size: 15px;
  font-weight: 500;
  margin: 0;
}

.crypto-symbol {
  color: var(--text-secondary);
  font-size: 13px;
  text-transform: uppercase;
}

.crypto-price-info {
  text-align: right;
}

.price {
  font-weight: 500;
  font-size: 15px;
  margin-bottom: 2px;
}

.change-pill {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}

.change-pill.positive {
  background: rgba(38, 173, 117, 0.1);
  color: var(--price-up-color);
}

.change-pill.negative {
  background: rgba(234, 57, 67, 0.1);
  color: var(--price-down-color);
}

.crypto-market-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.market-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  justify-content: flex-end;
}

.label {
  font-size: 12px;
  color: var(--text-secondary);
}

.value {
  font-size: 13px;
  color: var(--text-primary);
}
</style>
