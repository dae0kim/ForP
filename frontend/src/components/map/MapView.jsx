import { useEffect, useRef, useState } from 'react';
import { Box, Paper, TextField, Button, List, ListItem, ListItemText, Divider, ListItemButton } from '@mui/material';

function MapView() {
    const mapRef = useRef(null);
    const mapInstance = useRef(null); // 검색 후 중심 이동을 위해 지도 객체 저장
    const [keyword, setKeyword] = useState("동물병원"); // 기본 검색 키워드값
    const [places, setPlaces] = useState([]); // 검색 결과

    // 검색 로직
    const searchPlaces = (searchKeyword, map) => {
        const { kakao } = window;
        const ps = new kakao.maps.services.Places();

        // 현재 지도 중심 기준으로 검색
        const options = {
            location: map.getCenter(),
            bounds: map.getBounds(),
            sort: kakao.maps.services.SortBy.ACCURACY
        };

        ps.keywordSearch(searchKeyword, (data, status) => {
            if (status === kakao.maps.services.Status.OK) {
                setPlaces(data);
                // 마커 표시
                data.forEach((place) => {
                    new kakao.maps.Marker({
                        map: map,
                        position: new kakao.maps.LatLng(place.y, place.x),
                    });
                });
            }
        }, options);
    };

    useEffect(() => {
        const { kakao } = window;

        kakao.maps.load(() => {
            if (!mapRef.current) return;

            const options = {
                center: new kakao.maps.LatLng(37.5665, 126.9780),
                level: 4,
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
                        // 위치 잡은 후 검색 실행
                        searchPlaces("동물병원", map);
                    },
                    (error) => {
                        console.error(error);
                        // 위치 획득 실패 시에도 기본 위치에서 검색 실행
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
        const { kakao } = window;

        if (!keyword.trim()) return alert("키워드를 입력해주세요!");

        const ps = new kakao.maps.services.Places();
        const currentBounds = mapInstance.current.getBounds();
        const searchOptions = {
            bounds: currentBounds, // 현재 화면 안에서만 찾기
            location: mapInstance.current.getCenter() // 현재 중심점 기준
        };

        ps.keywordSearch(keyword, (data, status) => {
            if (status === kakao.maps.services.Status.OK) {
                setPlaces(data);
                data.forEach((place) => {
                    const marker = new kakao.maps.Marker({
                        map: mapInstance.current,
                        position: new kakao.maps.LatLng(place.y, place.x),
                    });
                });
            } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
                alert("현재 화면 내에는 검색 결과가 없습니다.");
            } else {
                alert("에러가 발생했습니다.");
            }
        }, searchOptions);
    };

    // 검색 결과 클릭 핸들러
    const handlePlaceClick = (place) => {
        if (!mapInstance.current) return;
        const { kakao } = window;
        const moveLatLon = new kakao.maps.LatLng(place.y, place.x);
        mapInstance.current.panTo(moveLatLon);
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
                                onClick={() => handlePlaceClick(place)}
                                sx={{
                                    '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.1)' }
                                }}
                            >
                                <ListItemText
                                    primary={`${i + 1}. ${place.place_name}`}
                                    secondary={place.address_name}
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