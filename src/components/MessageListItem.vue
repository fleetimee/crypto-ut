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
        <div class="crypto-image-container">
          <img
            v-if="crypto.image"
            :src="crypto.image"
            :alt="crypto.name"
            class="crypto-image"
            @error="handleImageError"
          />
          <div v-else class="crypto-icon">
            {{ crypto.symbol[0].toUpperCase() }}
          </div>
        </div>
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
import { ref } from "vue";

defineProps<{
  crypto: Crypto;
}>();

const showFallback = ref(false);

const handleImageError = (event: Event) => {
  showFallback.value = true;
  const img = event.target as HTMLImageElement;
  img.style.display = "none";
};

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
  /* Adjust column widths to be more compact on mobile */
  grid-template-columns: 2fr 1fr 1fr;
  gap: 8px;
  width: 100%;
  align-items: center;
  padding: 8px 0;
}

.crypto-main-info {
  display: flex;
  align-items: center;
  gap: 8px; /* Reduce gap from 12px to 8px */
  min-width: 0; /* Allow content to shrink */
}

.crypto-rank {
  color: var(--text-secondary);
  font-size: 12px; /* Slightly smaller font */
  min-width: 20px; /* Smaller min-width */
}

.crypto-name-section {
  display: flex;
  flex-direction: column; /* Stack name and symbol vertically */
  gap: 2px;
  min-width: 0; /* Allow text to shrink */
  overflow: hidden; /* Enable text truncation */
}

.crypto-name-section h2 {
  font-size: 14px; /* Slightly smaller font */
  font-weight: 500;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.crypto-symbol {
  color: var(--text-secondary);
  font-size: 12px;
  text-transform: uppercase;
}

/* Adjust price info section */
.crypto-price-info {
  text-align: right;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.price {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.change-pill {
  padding: 2px 6px;
  font-size: 12px;
  white-space: nowrap;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.change-pill.positive {
  background: rgba(38, 173, 117, 0.1);
  color: var(--price-up-color);
}

.change-pill.negative {
  background: rgba(234, 57, 67, 0.1);
  color: var(--price-down-color);
}

/* Adjust market info section */
.crypto-market-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.market-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  justify-content: flex-end;
}

.value {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.label {
  font-size: 11px;
}

.crypto-image-container {
  width: 20px; /* Smaller from 24px */
  height: 20px; /* Smaller from 24px */
  flex-shrink: 0; /* Prevent image from shrinking */
}

.crypto-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background-color: white;
}

.crypto-icon {
  width: 20px; /* Match container size */
  height: 20px; /* Match container size */
  border-radius: 50%;
  background: var(--ion-color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px; /* Smaller font size */
  font-weight: 600;
  text-transform: uppercase;
}

/* Add media query for larger screens */
@media (min-width: 768px) {
  .crypto-item-container {
    grid-template-columns: 2.5fr 1.5fr 2fr;
    gap: 12px;
  }

  .crypto-main-info {
    gap: 12px;
  }

  .crypto-image-container,
  .crypto-icon {
    width: 24px;
    height: 24px;
  }

  .crypto-name-section h2 {
    font-size: 15px;
  }

  .crypto-symbol {
    font-size: 13px;
  }

  .price {
    font-size: 15px;
  }

  .change-pill {
    font-size: 13px;
    padding: 2px 8px;
  }

  .value {
    font-size: 13px;
  }

  .label {
    font-size: 12px;
  }
}
</style>
