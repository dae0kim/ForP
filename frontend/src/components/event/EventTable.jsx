import { Box, Card, Typography, Stack, Link, CardMedia, CardContent } from '@mui/material';
import React from 'react';
import { eventList } from '../../data/events';

// 이벤트 목록 호출 컴포넌트
function EventTable(props) {
    
    return (
        <Box sx={{ flex:1 }}>
            {/* ------------------------ 이벤트 ------------------------- */}
            <Box>
                <Typography variant="h6" component='h1' fontWeight={600} 
                    sx={{ mb:2, fontSize: '32px'}}>이벤트</Typography>
                {/* Event cards */}
                <Stack 
                    direction='row' // 가로 배치
                    spacing={2}
                    sx={{
                        overflowX: 'auto', // 가로 스크롤 활성화
                        pb:1 // padding-bottom
                    }}
                >
                    {eventList.map((event) => (
                        <Card 
                        key={event.id}
                        component={Link} 
                        to={`/events/${event.id}`}
                        sx={{
                            minWidth: 410,
                            textDecoration: "none",
                            borderRadius: 8
                        }}>
                            <CardMedia component="img" 
                            height="250"
                            image={event.image}
                            sx={{objectFit: 'contain'}}
                            />
                            <CardContent sx={{p: 1.5}}>
                                <Typography fontWeight={600} sx={{pb: 1.5}}>
                                    {event.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {event.subTitle}
                                </Typography>
                            </CardContent> 
                        </Card>
                    ))}
                </Stack>
            </Box>
        </Box>
    );
}

export default EventTable;