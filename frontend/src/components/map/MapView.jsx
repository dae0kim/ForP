import { useEffect, useRef, useState } from 'react';
import { Box, Paper, TextField, Button, List, ListItem, ListItemText, Divider, ListItemButton } from '@mui/material';

function MapView() {
    const mapRef = useRef(null);
    const mapInstance = useRef(null); // 검색 후 중심 이동을 위해 지도 객체 저장
    const markersRef = useRef([]);  // 지도 마커 저장값
    const infoWindowRef = useRef(null); // 인포윈도우 객체 저장
    const [keyword, setKeyword] = useState("동물병원"); // 기본 검색 키워드값
    const [places, setPlaces] = useState([]); // 검색 결과

    // 마커 제거 함수
    const removeMarkers = () => {
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
        // 인포윈도우도 닫기
        if (infoWindowRef.current) {
            infoWindowRef.current.close();
        }
    };

    // 검색 로직
    const searchPlaces = (searchKeyword, map) => {
        if (!map) return; // 지도 객체가 없으면 리턴

        const { kakao } = window;
        const ps = new kakao.maps.services.Places();

        // [추가] 간헐적 마킹 누락 방지: 영역 정보(Bounds)가 없으면 0.1초 뒤 재시도
        const bounds = map.getBounds();
        if (!bounds) {
            setTimeout(() => searchPlaces(searchKeyword, map), 100);
            return;
        }

        // 현재 지도 중심 기준으로 검색
        const options = {
            location: map.getCenter(),
            bounds: bounds,
            sort: kakao.maps.services.SortBy.ACCURACY
        };

        ps.keywordSearch(searchKeyword, (data, status) => {
            if (status === kakao.maps.services.Status.OK) {
                // 검색 성공 시 기존 마커 제거
                removeMarkers();

                setPlaces(data);

                // 새 마커 생성 및 저장
                const newMarkers = data.map((place) => {
                    const marker = new kakao.maps.Marker({
                        map: map,
                        position: new kakao.maps.LatLng(place.y, place.x),
                    });

                    // 인포윈도우 생성 및 마커 클릭 이벤트 연결
                    kakao.maps.event.addListener(marker, 'click', () => {
                        displayInfoWindow(marker, place.place_name, map);
                    });

                    return marker;
                });

                markersRef.current = newMarkers; // ref에 저장
            }
        }, options);
    };

    // 인포윈도우 표시 함수
    const displayInfoWindow = (marker, title, map) => {
        const { kakao } = window;
        if (!infoWindowRef.current) {
            infoWindowRef.current = new kakao.maps.InfoWindow({ zIndex: 1 });
        }

        const content = `<div style="padding:5px;z-index:1;font-size:12px;text-align:center;width:150px;">${title}</div>`;
        infoWindowRef.current.setContent(content);
        infoWindowRef.current.open(map, marker);
    };

    useEffect(() => {
        const { kakao } = window;

        kakao.maps.load(() => {
            if (!mapRef.current) return;

            const options = {
                center: new kakao.maps.LatLng(37.5665, 126.9780),
                level: 5,
            };
            const map = new kakao.maps.Map(mapRef.current, options);
            mapInstance.current = map;

            // 컨트롤러 추가
            map.addControl(new kakao.maps.MapTypeControl(), kakao.maps.ControlPosition.TOPRIGHT);
            map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT);

            // 현재 위치 기반 자동 검색 실행
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const locPosition = new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        map.setCenter(locPosition);

                        // tilesloaded 이벤트를 사용하여 지도가 준비된 후 검색 실행
                        const handleInitialSearch = () => {
                            searchPlaces("동물병원", map);
                            // 실행 후 리스너 제거 (addListenerOnce의 수동 구현)
                            kakao.maps.event.removeListener(map, 'tilesloaded', handleInitialSearch);
                        };

                        kakao.maps.event.addListener(map, 'tilesloaded', handleInitialSearch);
                    },
                    (error) => {
                        console.error(error);
                        searchPlaces("동물병원", map);
                    },
                    { enableHighAccuracy: true }
                );
            } else {
                searchPlaces("동물병원", map);
            }
        });
    }, []);

    // 검색 실행 핸들러
    const handleSearch = (e) => {
        if (e) e.preventDefault();

        if (!keyword.trim()) return alert("키워드를 입력해주세요!");

        // 기존 searchPlaces 함수를 재사용하여 마커 생성 로직 중복 제거
        searchPlaces(keyword, mapInstance.current);
    };

    // 검색 결과 클릭 핸들러
    const handlePlaceClick = (place, index) => {
        if (!mapInstance.current) return;
        const { kakao } = window;
        const moveLatLon = new kakao.maps.LatLng(place.y, place.x);
        mapInstance.current.panTo(moveLatLon);

        // 리스트 클릭 시 해당 마커의 인포윈도우 표시
        const targetMarker = markersRef.current[index];
        if (targetMarker) {
            displayInfoWindow(targetMarker, place.place_name, mapInstance.current);
        }
    };

    return (
        <Box sx={{ position: 'relative', width: '100%', height: '600px' }}>
            {/* 좌측 검색창 */}
            <Paper
                sx={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    zIndex: 10,
                    width: '300px',
                    maxHeight: '550px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(8px)',
                    transition: 'background-color 0.3s',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    },
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.3)',
                }}
            >
                {/* 검색창 내부 */}
                <Box component="form" onSubmit={handleSearch} sx={{ p: 2, display: 'flex', gap: 1 }}>
                    <TextField
                        size="small"
                        fullWidth
                        placeholder="검색어 입력"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        sx={{ backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 1 }}
                    />
                    <Button variant="contained" type="submit">검색</Button>
                </Box>

                <Divider sx={{ backgroundColor: 'rgba(0,0,0,0.05)' }} />

                {/* 검색 결과 목록 */}
                <List sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    backgroundColor: 'transparent'
                }}>
                    {places.map((place, i) => (
                        <ListItem key={place.id} divider disablePadding>
                            <ListItemButton
                                onClick={() => handlePlaceClick(place, i)}
                                sx={{
                                    '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.1)' }
                                }}
                            >
                                <ListItemText
                                    primary={`${i + 1}. ${place.place_name}`}
                                    secondary={
                                        <>
                                            {/* 도로명 주소가 있으면 도로명을, 없으면 지번 주소를 표시 */}
                                            <Box component="span" sx={{ display: 'block', fontSize: '0.85rem', color: 'text.secondary', mt: 0.5 }}>
                                                {place.road_address_name || place.address_name}
                                            </Box>
                                            {/* 지번 주소 */}
                                            {place.road_address_name && (
                                                <Box component="span" sx={{ display: 'block', fontSize: '0.75rem', color: 'text.disabled' }}>
                                                    (지번) {place.address_name}
                                                </Box>
                                            )}
                                            {/* 전화번호 */}
                                            {place.phone && (
                                                <Box component="span" sx={{ display: 'block', fontSize: '0.8rem', color: 'primary.main', fontWeight: 'medium', mt: 0.3 }}>
                                                    {place.phone}
                                                </Box>
                                            )}
                                        </>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Paper>
            {/* 지도 */}
            <Box ref={mapRef} sx={{ width: '100%', height: '100%', borderRadius: '8px' }} />
        </Box>
    );
}

export default MapView;