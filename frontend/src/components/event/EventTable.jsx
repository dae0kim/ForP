import { Box, Card, Typography, Stack, Link, CardMedia, CardContent, Grid } from '@mui/material';
import React from 'react';
import { eventList } from '../../data/events';

// 이벤트 목록 호출 컴포넌트
function EventTable(props) {
    
    return (
        <Box sx={{ flex:1 }}>
            {/* ------------------------ 이벤트 ------------------------- */}
                <Typography variant="h6" component='h1' fontWeight={600} 
                    sx={{ mb:2, fontSize: '32px'}}>이벤트</Typography>
                {/* Event cards */}
                <Grid 
                    direction='row' // 가로 배치
                    spacing={2}
                    sx={{
                        display:"grid",
                        gridTemplateColumns:"repeat(3,1fr)", // 최대 3개
                        gap:3,
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
            </Grid>
        </Box>
    );
}

export default EventTable;