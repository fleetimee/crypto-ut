<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Crypto Markets</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar
          v-model="searchQuery"
          placeholder="Search by name or symbol"
          :debounce="300"
          class="modern-searchbar"
        ></ion-searchbar>
      </ion-toolbar>
      <ion-toolbar class="filter-toolbar">
        <ion-segment v-model="sortBy" class="custom-segment">
          <ion-segment-button value="rank">
            <ion-label>Rank</ion-label>
          </ion-segment-button>
          <ion-segment-button value="gainers">
            <ion-label>Gainers</ion-label>
          </ion-segment-button>
          <ion-segment-button value="losers">
            <ion-label>Losers</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="crypto-content">
      <div class="global-stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <ion-icon :icon="analytics" class="stat-icon"></ion-icon>
            <div class="stat-title">Market Cap</div>
          </div>
          <div class="stat-main-value">
            ${{ formatCompactNumber(globalStats?.total_mcap || 0) }}
          </div>
          <div
            class="stat-footer"
            :class="getChangeClass(globalStats?.mcap_change)"
          >
            <ion-icon
              :icon="
                Number(globalStats?.mcap_change) >= 0
                  ? trendingUp
                  : trendingDown
              "
            ></ion-icon>
            {{ globalStats?.mcap_change }}%
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <ion-icon :icon="barChart" class="stat-icon"></ion-icon>
            <div class="stat-title">24h Volume</div>
          </div>
          <div class="stat-main-value">
            ${{ formatCompactNumber(globalStats?.total_volume || 0) }}
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <ion-icon :icon="pieChart" class="stat-icon"></ion-icon>
            <div class="stat-title">Dominance</div>
          </div>
          <div class="dominance-grid">
            <div class="dominance-item">
              <span class="crypto-symbol btc">₿</span>
              <div class="dominance-value">{{ globalStats?.btc_d }}%</div>
            </div>
            <div class="dominance-item">
              <span class="crypto-symbol eth">Ξ</span>
              <div class="dominance-value">{{ globalStats?.eth_d }}%</div>
            </div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <ion-icon :icon="apps" class="stat-icon"></ion-icon>
            <div class="stat-title">Active Coins</div>
          </div>
          <div class="stat-main-value with-label">
            {{ formatNumber(globalStats?.coins_count || 0) }}
            <span class="stat-label">coins</span>
          </div>
        </div>
      </div>

      <ion-refresher slot="fixed" @ionRefresh="refresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-list class="crypto-list">
        <MessageListItem
          v-for="crypto in filteredCryptos"
          :key="crypto.id"
          :crypto="crypto"
        />
      </ion-list>

      <div v-if="filteredCryptos.length === 0" class="no-results">
        <ion-text color="medium">
          <p>No cryptocurrencies found</p>
        </ion-text>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonText,
} from "@ionic/vue";
import MessageListItem from "@/components/MessageListItem.vue";
import { ref, computed, onMounted } from "vue";
import type { Crypto, GlobalStats } from "@/types";
import {
  analytics,
  barChart,
  pieChart,
  apps,
  trendingUp,
  trendingDown,
} from "ionicons/icons";

const cryptos = ref<Crypto[]>([]);

const fetchData = async () => {
  try {
    const response = await fetch("https://api.coinlore.net/api/tickers/");
    const json = await response.json();
    cryptos.value = json.data;
  } catch (error) {
    console.error("Error fetching crypto data:", error);
  }
};

const globalStats = ref<GlobalStats | null>(null);

const fetchGlobalStats = async () => {
  try {
    const response = await fetch("https://api.coinlore.net/api/global/");
    const data = await response.json();
    globalStats.value = data[0];
  } catch (error) {
    console.error("Error fetching global stats:", error);
  }
};

const formatNumber = (num: number) => {
  return num.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
};

const formatCompactNumber = (number: number) => {
  return number.toLocaleString(undefined, {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 2,
  });
};

const getChangeClass = (change: string | undefined) => {
  if (!change) return "";
  return Number(change) >= 0 ? "positive" : "negative";
};

const refresh = async (ev: CustomEvent) => {
  await Promise.all([fetchData(), fetchGlobalStats()]);
  ev.detail.complete();
};

onMounted(() => {
  fetchData();
  fetchGlobalStats();
});

const searchQuery = ref("");
const sortBy = ref("rank");

const filteredCryptos = computed(() => {
  let result = cryptos.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(query) ||
        crypto.symbol.toLowerCase().includes(query)
    );
  }

  switch (sortBy.value) {
    case "rank":
      return result.sort((a, b) => Number(a.rank) - Number(b.rank));
    case "gainers":
      return result.sort(
        (a, b) => Number(b.percent_change_24h) - Number(a.percent_change_24h)
      );
    case "losers":
      return result.sort(
        (a, b) => Number(a.percent_change_24h) - Number(b.percent_change_24h)
      );
    default:
      return result;
  }
});
</script>

<style scoped>
.filter-toolbar {
  padding: 0 8px 8px;
}

.modern-searchbar {
  --background: var(--item-background);
  --box-shadow: none;
  --border-radius: 8px;
  --placeholder-color: var(--text-secondary);
  --color: var(--text-primary);
  --icon-color: var(--text-secondary);
  padding: 0 8px;
}

.custom-segment {
  --background: var(--item-background);
  border-radius: 8px;
  padding: 3px;
}

ion-segment-button {
  --background-checked: var(--accent-blue);
  --color-checked: #ffffff;
  --indicator-color: transparent;
  min-height: 32px;
  font-size: 13px;
  text-transform: none;
  border-radius: 6px;
}

ion-segment-button::part(indicator) {
  display: none;
}

.no-results {
  text-align: center;
  padding: 32px 16px;
  color: var(--text-secondary);
}

ion-list {
  background: transparent;
}

.global-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 12px;
  margin-bottom: 8px;
}

.stat-card {
  background: var(--item-background);
  padding: 16px;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.stat-icon {
  font-size: 18px;
  color: var(--accent-blue);
}

.stat-title {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

.stat-main-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.stat-main-value.with-label {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stat-label {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: normal;
}

.stat-footer {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  font-size: 13px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  width: fit-content;
}

.stat-footer.positive {
  background: rgba(38, 173, 117, 0.1);
  color: var(--price-up-color);
}

.stat-footer.negative {
  background: rgba(234, 57, 67, 0.1);
  color: var(--price-down-color);
}

.dominance-grid {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.dominance-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.crypto-logo {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.dominance-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.crypto-symbol {
  font-size: 20px;
  font-weight: 600;
}

.crypto-symbol.btc {
  color: #f7931a;
}

.crypto-symbol.eth {
  color: #627eea;
}

.crypto-icon {
  font-size: 20px;
}

/* Add subtle gradient backgrounds */
.stat-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(to right, var(--accent-blue), transparent);
  opacity: 0.5;
}
</style>
