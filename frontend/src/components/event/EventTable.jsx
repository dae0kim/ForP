import { Box, Card, Typography, CardMedia, CardContent, Stack } from '@mui/material';
import { eventList } from '../../data/events';
import { NavLink } from 'react-router';

// 이벤트 목록 호출 컴포넌트
function EventTable() {
    return (
        <Stack direction="row" justifyContent="center">
            <Box sx={{ width: '100%', px: 3, mb: 10 }}>
                {/* ------------------------ 이벤트 ------------------------- */}
                <Typography variant="h6" component='h1' fontWeight={600}
                    sx={{
                        mt: 4,
                        mb: 4,
                        textAlign: 'left',
                        width: '100%',
                        fontSize: '32px'
                    }}>이벤트</Typography>
                {/* Event cards */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 4, // 카드 사이 간격 확대
                        width: '100%',
                    }}>
                    {eventList.map((event) => (
                        <Card
                            key={event.id}
                            component={NavLink}
                            to={`/events/${event.id}`}
                            sx={{
                                width: '100%',
                                textDecoration: "none",
                                borderRadius: 8
                            }}>
                            <CardMedia component="img"
                                height="250"
                                image={event.image}
                                sx={{ objectFit: 'contain' }}
                            />
                            <CardContent sx={{ p: 2 }}>
                                <Typography fontWeight={600} sx={{ fontSize: '20px', pb: 1 }}>
                                    {event.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '18px' }}>
                                    {event.subTitle}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box>
        </Stack>
    );
}

export default EventTable;