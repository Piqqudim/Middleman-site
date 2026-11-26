import React, { useCallback, useEffect, useState } from 'react';
import {
  AdvancedMarker,
  type AdvancedMarkerProps,
  APILoadingStatus,
  APIProvider,
  InfoWindow,
  Map as GoogleMap,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  useMap,
} from '@vis.gl/react-google-maps';
import { ArrowRight, Compass, MapPin } from 'lucide-react';
import type { PropertyListing } from '../data/properties';
import { type CurrencyCode, formatMoney } from '../utils/mortgage';

interface PropertyMapViewProps {
  properties: PropertyListing[];
  currency: CurrencyCode;
  selectedPropertyId: string | null;
  hoveredPropertyId: string | null;
  onSelectMarker: (property: PropertyListing) => void;
  onOpenDetail: (property: PropertyListing) => void;
  quotaExceeded: boolean;
}

type AdvancedMarkerInstance = NonNullable<ReturnType<typeof useAdvancedMarkerRef>[1]>;

interface AdvancedMarkerWithRefProps extends AdvancedMarkerProps {
  onMarkerClick: (marker: AdvancedMarkerInstance) => void;
}

const AdvancedMarkerWithRef: React.FC<AdvancedMarkerWithRefProps> = ({
  children,
  onMarkerClick,
  ...rest
}) => {
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <AdvancedMarker
      ref={markerRef}
      onClick={() => {
        if (marker) {
          onMarkerClick(marker);
        }
      }}
      {...rest}
    >
      {children}
    </AdvancedMarker>
  );
};

const CameraFocusController: React.FC<{
  selectedProperty: PropertyListing | null;
  properties: PropertyListing[];
}> = ({ selectedProperty, properties }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || properties.length === 0) return;
    if (properties.length === 1) {
      map.panTo({ lat: properties[0].lat, lng: properties[0].lng });
      map.setZoom(13);
      return;
    }
    const gMaps = (
      window as unknown as {
        google?: {
          maps?: {
            LatLngBounds?: new () => { extend: (p: { lat: number; lng: number }) => void };
          };
        };
      }
    ).google?.maps;
    if (gMaps?.LatLngBounds) {
      const bounds = new gMaps.LatLngBounds();
      properties.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }));
      map.fitBounds(bounds as unknown as Parameters<typeof map.fitBounds>[0], 56);
    }
  }, [map, properties]);

  useEffect(() => {
    if (map && selectedProperty) {
      map.panTo({ lat: selectedProperty.lat, lng: selectedProperty.lng });
    }
  }, [map, selectedProperty]);

  return null;
};

const MapCanvasInner: React.FC<{
  properties: PropertyListing[];
  currency: CurrencyCode;
  selectedPropertyId: string | null;
  hoveredPropertyId: string | null;
  onSelectMarker: (property: PropertyListing) => void;
  onOpenDetail: (property: PropertyListing) => void;
  onFallbackTrigger: () => void;
}> = ({
  properties,
  currency,
  selectedPropertyId,
  hoveredPropertyId,
  onSelectMarker,
  onOpenDetail,
  onFallbackTrigger,
}) => {
  const status = useApiLoadingStatus();
  const [activeMarker, setActiveMarker] = useState<AdvancedMarkerInstance | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);

  const selectedProperty =
    properties.find((p) => p.id === selectedPropertyId) ?? properties[0] ?? null;

  useEffect(() => {
    if (status === APILoadingStatus.FAILED || status === APILoadingStatus.AUTH_FAILURE) {
      onFallbackTrigger();
    }
  }, [status, onFallbackTrigger]);

  const handleMarkerClick = useCallback(
    (property: PropertyListing, marker: AdvancedMarkerInstance) => {
      setActiveMarker(marker);
      setInfoOpen(true);
      onSelectMarker(property);
    },
    [onSelectMarker]
  );

  // Sort by descending lat for consistent depth stacking
  const sortedByLat = [...properties].sort((a, b) => b.lat - a.lat);

  const defaultCenter = selectedProperty
    ? { lat: selectedProperty.lat, lng: selectedProperty.lng }
    : { lat: 6.3228, lng: 5.616 };

  return (
    <div className="relative w-full h-[440px] lg:h-[580px]">
      <GoogleMap
        mapId="DEMO_MAP_ID"
        defaultCenter={defaultCenter}
        defaultZoom={11}
        gestureHandling="greedy"
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        style={{ width: '100%', height: '100%' }}
      >
        <CameraFocusController selectedProperty={selectedProperty} properties={properties} />
        {sortedByLat.map((property, index) => {
          const isSelected = property.id === selectedPropertyId;
          const isHovered = property.id === hoveredPropertyId;
          const zIndex = isSelected ? 1000 : isHovered ? 900 : index;

          return (
            <AdvancedMarkerWithRef
              key={property.id}
              position={{ lat: property.lat, lng: property.lng }}
              zIndex={zIndex}
              title={property.title}
              onMarkerClick={(marker) => handleMarkerClick(property, marker)}
            >
              <div
                className={`px-2.5 py-1 text-xs font-medium tabular-nums border shadow-sm transition-transform duration-150 ${
                  isSelected
                    ? 'bg-[#c8a97e] text-[#141210] border-[#141210] scale-110'
                    : isHovered
                      ? 'bg-[#141210] text-[#c8a97e] border-[#c8a97e] scale-105'
                      : 'bg-[#141210] text-[#f4f1ec] border-white/25'
                }`}
              >
                {formatMoney(property.priceNgn, currency, true)}
              </div>
            </AdvancedMarkerWithRef>
          );
        })}

        {infoOpen && activeMarker && selectedProperty && (
          <InfoWindow anchor={activeMarker} onCloseClick={() => setInfoOpen(false)}>
            <div className="p-1 max-w-[230px] text-[#141210] space-y-1.5">
              <p className="text-[11px] uppercase tracking-wider text-[#8a6d46] font-medium">
                {selectedProperty.category}
              </p>
              <h4 className="font-serif text-lg leading-tight font-semibold">
                {selectedProperty.title}
              </h4>
              <p className="text-xs text-neutral-600">{selectedProperty.location}</p>
              <p className="text-sm font-semibold tabular-nums">
                {formatMoney(selectedProperty.priceNgn, currency)}
              </p>
              <button
                type="button"
                onClick={() => onOpenDetail(selectedProperty)}
                className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[#141210] underline underline-offset-4 hover:text-[#8a6d46] cursor-pointer"
              >
                <span>Inspect Property</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export const PropertyMapView: React.FC<PropertyMapViewProps> = ({
  properties,
  currency,
  selectedPropertyId,
  hoveredPropertyId,
  onSelectMarker,
  onOpenDetail,
  quotaExceeded,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const [mapsUnavailable, setMapsUnavailable] = useState(false);

  const shouldRenderFallback = !apiKey || quotaExceeded || mapsUnavailable;
  const activeProperty =
    properties.find((p) => p.id === selectedPropertyId) ?? properties[0] ?? null;

  if (shouldRenderFallback) {
    return (
      <div
        data-testid="property-map-fallback"
        className="relative w-full h-[440px] lg:h-[580px] bg-[#181613] text-[#f4f1ec] border border-[#141210]/15 dark:border-white/15 flex flex-col justify-between p-5 overflow-hidden"
      >
        {/* Subtle Architectural Coordinate Grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(200,169,126,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(200,169,126,0.18) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />

        <div className="relative z-10 flex items-center justify-between gap-4 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-xs text-[#c8a97e]">
            <Compass className="w-4 h-4" aria-hidden="true" />
            <span className="tracking-[0.16em] uppercase font-medium">
              Interactive Portfolio Locator
            </span>
          </div>
          <span className="text-[11px] text-[#f4f1ec]/65 tabular-nums">
            {properties.length} pinned {properties.length === 1 ? 'listing' : 'listings'}
          </span>
        </div>

        {/* Interactive Geospatial Pin Canvas */}
        <div className="relative z-10 flex-1 my-4 border border-white/10 bg-[#11100e]/85 p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 content-start">
          {properties.map((property) => {
            const isSelected = property.id === activeProperty?.id;
            return (
              <button
                key={property.id}
                type="button"
                onClick={() => onSelectMarker(property)}
                className={`text-left p-3 border transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-[#c8a97e] bg-[#c8a97e]/15'
                    : 'border-white/10 bg-[#181613] hover:border-[#c8a97e]/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#c8a97e] tabular-nums">
                    <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    {formatMoney(property.priceNgn, currency, true)}
                  </span>
                  <span className="font-mono text-[10px] text-[#f4f1ec]/50 tabular-nums">
                    {property.lat.toFixed(3)}, {property.lng.toFixed(3)}
                  </span>
                </div>
                <p className="mt-1.5 font-serif text-base text-[#f4f1ec] truncate">
                  {property.title}
                </p>
                <p className="text-[11px] text-[#f4f1ec]/65 truncate">{property.location}</p>
              </button>
            );
          })}
        </div>

        {activeProperty && (
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
            <div className="min-w-0">
              <p className="text-xs text-[#c8a97e]">{activeProperty.location}</p>
              <p className="font-serif text-lg truncate">{activeProperty.title}</p>
            </div>
            <button
              type="button"
              onClick={() => onOpenDetail(activeProperty)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-[#c8a97e] text-[#141210] hover:bg-[#b59467] transition-colors cursor-pointer shrink-0"
            >
              <span>Inspect Selected</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      data-testid="property-map-canvas"
      className="w-full h-[440px] lg:h-[580px] border border-[#141210]/15 dark:border-white/15 overflow-hidden bg-[#181613]"
    >
      <APIProvider apiKey={apiKey} libraries={['marker']} language="en" region="NG">
        <MapCanvasInner
          properties={properties}
          currency={currency}
          selectedPropertyId={selectedPropertyId}
          hoveredPropertyId={hoveredPropertyId}
          onSelectMarker={onSelectMarker}
          onOpenDetail={onOpenDetail}
          onFallbackTrigger={() => setMapsUnavailable(true)}
        />
      </APIProvider>
    </div>
  );
};
