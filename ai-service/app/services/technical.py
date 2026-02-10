"""Technical analysis service using pandas and pandas-ta."""

import logging
from typing import Optional

import numpy as np
import pandas as pd

from ..models.schemas import CandleData

logger = logging.getLogger(__name__)

# Attempt to import pandas_ta; fall back to manual calculations if unavailable.
try:
    import pandas_ta as ta  # noqa: F401

    HAS_PANDAS_TA = True
except ImportError:
    HAS_PANDAS_TA = False
    logger.warning(
        "pandas-ta not installed; falling back to basic numpy calculations."
    )


class TechnicalAnalyzer:
    """Computes technical indicators from candlestick data."""

    # ------------------------------------------------------------------
    # Fallback helpers (pure numpy / pandas) used when pandas-ta is absent
    # ------------------------------------------------------------------

    @staticmethod
    def _sma(series: pd.Series, period: int) -> pd.Series:
        return series.rolling(window=period, min_periods=1).mean()

    @staticmethod
    def _ema(series: pd.Series, period: int) -> pd.Series:
        return series.ewm(span=period, adjust=False).mean()

    @staticmethod
    def _rsi(series: pd.Series, period: int = 14) -> pd.Series:
        delta = series.diff()
        gain = delta.where(delta > 0, 0.0)
        loss = -delta.where(delta < 0, 0.0)
        avg_gain = gain.ewm(alpha=1 / period, min_periods=period, adjust=False).mean()
        avg_loss = loss.ewm(alpha=1 / period, min_periods=period, adjust=False).mean()
        rs = avg_gain / avg_loss.replace(0, np.nan)
        rsi = 100.0 - (100.0 / (1.0 + rs))
        return rsi

    @staticmethod
    def _macd(
        series: pd.Series,
        fast: int = 12,
        slow: int = 26,
        signal: int = 9,
    ) -> tuple[pd.Series, pd.Series, pd.Series]:
        ema_fast = series.ewm(span=fast, adjust=False).mean()
        ema_slow = series.ewm(span=slow, adjust=False).mean()
        macd_line = ema_fast - ema_slow
        signal_line = macd_line.ewm(span=signal, adjust=False).mean()
        histogram = macd_line - signal_line
        return macd_line, signal_line, histogram

    @staticmethod
    def _bollinger_bands(
        series: pd.Series, period: int = 20, std_dev: float = 2.0
    ) -> tuple[pd.Series, pd.Series, pd.Series]:
        mid = series.rolling(window=period, min_periods=1).mean()
        rolling_std = series.rolling(window=period, min_periods=1).std()
        upper = mid + std_dev * rolling_std
        lower = mid - std_dev * rolling_std
        return upper, mid, lower

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def analyze(self, candles: list[CandleData]) -> dict:
        """Return a dict of technical indicators computed from *candles*.

        If the list is empty or too short for meaningful analysis the method
        returns neutral default values.
        """
        defaults: dict = {
            "rsi": 50.0,
            "macd": 0.0,
            "macd_signal": 0.0,
            "macd_histogram": 0.0,
            "bb_upper": 0.0,
            "bb_middle": 0.0,
            "bb_lower": 0.0,
            "sma_20": 0.0,
            "sma_50": 0.0,
            "ema_12": 0.0,
            "ema_26": 0.0,
            "current_price": 0.0,
            "avg_volume": 0.0,
            "volume_ratio": 1.0,
        }

        if not candles or len(candles) < 2:
            return defaults

        df = pd.DataFrame([c.model_dump() for c in candles])
        df.sort_values("time", inplace=True)
        df.reset_index(drop=True, inplace=True)

        close = df["close"]
        volume = df["volume"]
        current_price = float(close.iloc[-1])

        if HAS_PANDAS_TA:
            rsi_series = ta.rsi(close, length=14)
            macd_df = ta.macd(close, fast=12, slow=26, signal=9)
            bb_df = ta.bbands(close, length=20, std=2.0)
            sma_20 = ta.sma(close, length=20)
            sma_50 = ta.sma(close, length=50)
            ema_12 = ta.ema(close, length=12)
            ema_26 = ta.ema(close, length=26)

            rsi_val = float(rsi_series.iloc[-1]) if rsi_series is not None and not rsi_series.empty else 50.0
            if macd_df is not None and not macd_df.empty:
                macd_val = float(macd_df.iloc[-1, 0])
                macd_signal_val = float(macd_df.iloc[-1, 1])
                macd_hist_val = float(macd_df.iloc[-1, 2])
            else:
                macd_val = macd_signal_val = macd_hist_val = 0.0
            if bb_df is not None and not bb_df.empty:
                bb_lower_val = float(bb_df.iloc[-1, 0])
                bb_mid_val = float(bb_df.iloc[-1, 1])
                bb_upper_val = float(bb_df.iloc[-1, 2])
            else:
                bb_upper_val = bb_mid_val = bb_lower_val = 0.0
            sma_20_val = float(sma_20.iloc[-1]) if sma_20 is not None and not sma_20.empty else current_price
            sma_50_val = float(sma_50.iloc[-1]) if sma_50 is not None and not sma_50.empty else current_price
            ema_12_val = float(ema_12.iloc[-1]) if ema_12 is not None and not ema_12.empty else current_price
            ema_26_val = float(ema_26.iloc[-1]) if ema_26 is not None and not ema_26.empty else current_price
        else:
            # Fallback numpy/pandas calculations
            rsi_series = self._rsi(close, 14)
            macd_line, signal_line, histogram = self._macd(close, 12, 26, 9)
            bb_upper_s, bb_mid_s, bb_lower_s = self._bollinger_bands(close, 20, 2.0)
            sma_20_s = self._sma(close, 20)
            sma_50_s = self._sma(close, 50)
            ema_12_s = self._ema(close, 12)
            ema_26_s = self._ema(close, 26)

            rsi_val = float(rsi_series.iloc[-1]) if not np.isnan(rsi_series.iloc[-1]) else 50.0
            macd_val = float(macd_line.iloc[-1]) if not np.isnan(macd_line.iloc[-1]) else 0.0
            macd_signal_val = float(signal_line.iloc[-1]) if not np.isnan(signal_line.iloc[-1]) else 0.0
            macd_hist_val = float(histogram.iloc[-1]) if not np.isnan(histogram.iloc[-1]) else 0.0
            bb_upper_val = float(bb_upper_s.iloc[-1]) if not np.isnan(bb_upper_s.iloc[-1]) else 0.0
            bb_mid_val = float(bb_mid_s.iloc[-1]) if not np.isnan(bb_mid_s.iloc[-1]) else 0.0
            bb_lower_val = float(bb_lower_s.iloc[-1]) if not np.isnan(bb_lower_s.iloc[-1]) else 0.0
            sma_20_val = float(sma_20_s.iloc[-1]) if not np.isnan(sma_20_s.iloc[-1]) else current_price
            sma_50_val = float(sma_50_s.iloc[-1]) if not np.isnan(sma_50_s.iloc[-1]) else current_price
            ema_12_val = float(ema_12_s.iloc[-1]) if not np.isnan(ema_12_s.iloc[-1]) else current_price
            ema_26_val = float(ema_26_s.iloc[-1]) if not np.isnan(ema_26_s.iloc[-1]) else current_price

        avg_volume = float(volume.mean()) if len(volume) > 0 else 0.0
        current_volume = float(volume.iloc[-1]) if len(volume) > 0 else 0.0
        volume_ratio = current_volume / avg_volume if avg_volume > 0 else 1.0

        return {
            "rsi": rsi_val,
            "macd": macd_val,
            "macd_signal": macd_signal_val,
            "macd_histogram": macd_hist_val,
            "bb_upper": bb_upper_val,
            "bb_middle": bb_mid_val,
            "bb_lower": bb_lower_val,
            "sma_20": sma_20_val,
            "sma_50": sma_50_val,
            "ema_12": ema_12_val,
            "ema_26": ema_26_val,
            "current_price": current_price,
            "avg_volume": avg_volume,
            "volume_ratio": volume_ratio,
        }

    def get_signal_from_technicals(
        self, indicators: dict
    ) -> tuple[str, float]:
        """Score the indicators and return ``(signal_type, confidence)``.

        The score ranges from roughly -1 (strong sell) to +1 (strong buy).
        Confidence is the absolute value clamped to [0, 1].
        """
        score = 0.0
        components = 0

        rsi = indicators.get("rsi", 50.0)
        current_price = indicators.get("current_price", 0.0)

        # --- RSI ---
        if rsi < 30:
            score += 0.3  # oversold -> bullish
        elif rsi < 40:
            score += 0.1
        elif rsi > 70:
            score -= 0.3  # overbought -> bearish
        elif rsi > 60:
            score -= 0.1
        components += 1

        # --- MACD ---
        macd_hist = indicators.get("macd_histogram", 0.0)
        if macd_hist > 0:
            score += min(0.3, macd_hist * 10)  # bullish momentum
        else:
            score += max(-0.3, macd_hist * 10)  # bearish momentum
        components += 1

        # --- Bollinger Bands position ---
        bb_upper = indicators.get("bb_upper", 0.0)
        bb_lower = indicators.get("bb_lower", 0.0)
        if bb_upper > bb_lower and current_price > 0:
            bb_range = bb_upper - bb_lower
            if bb_range > 0:
                bb_position = (current_price - bb_lower) / bb_range
                if bb_position < 0.2:
                    score += 0.2  # near lower band -> bullish
                elif bb_position > 0.8:
                    score -= 0.2  # near upper band -> bearish
        components += 1

        # --- SMA crossover (20 vs 50) ---
        sma_20 = indicators.get("sma_20", 0.0)
        sma_50 = indicators.get("sma_50", 0.0)
        if sma_20 > 0 and sma_50 > 0:
            if sma_20 > sma_50:
                score += 0.15  # golden crossover signal
            else:
                score -= 0.15  # death crossover signal
        components += 1

        # --- EMA crossover (12 vs 26) ---
        ema_12 = indicators.get("ema_12", 0.0)
        ema_26 = indicators.get("ema_26", 0.0)
        if ema_12 > 0 and ema_26 > 0:
            if ema_12 > ema_26:
                score += 0.1
            else:
                score -= 0.1
        components += 1

        # --- Volume ---
        volume_ratio = indicators.get("volume_ratio", 1.0)
        if volume_ratio > 1.5:
            # High volume amplifies the current direction
            score *= 1.2
        elif volume_ratio < 0.5:
            # Low volume dampens confidence
            score *= 0.8
        components += 1

        # Normalise to [-1, 1]
        score = max(-1.0, min(1.0, score))

        if score > 0.15:
            signal_type = "BUY"
        elif score < -0.15:
            signal_type = "SELL"
        else:
            signal_type = "HOLD"

        confidence = min(1.0, abs(score))

        return signal_type, round(confidence, 4)
