import MapView from '../components/map/MapView';
import { Alert, AlertTitle, Container, Typography } from '@mui/material';

// 지도 조회 페이지
function Map() {
    return (
        <Container>
            <Typography variant="h4" sx={{ mt: 4 ,mb:4 }}>
                주변 동물병원 지도
            </Typography>
            {/* 지도 컴포넌트 */}
            <MapView />
            {/* 지도 하단 안내문구 */}
            <Alert severity="info" sx={{ mt: 2 }}>
                <AlertTitle>안내</AlertTitle>
                사용자 위치에 기반하여 주변 동물병원이 지도에 표시됩니다.<br />
                위치정보 제공에 동의하지 않은 경우 기본 설정 위치인 서울시청 주변의 지도가 보여집니다.
            </Alert>
        </Container>
    );
}

export default Map;