import MapView from '../components/map/MapView';
import { Container, Typography } from '@mui/material';

// 지도 조회 페이지
function Map() {
    return (
        <Container>
            <Typography variant="h4" sx={{ mt: 4 }}>
                주변 동물병원 지도
            </Typography>
            {/* 지도 컴포넌트 */}
            <MapView />
        </Container>
    );
}

export default Map;