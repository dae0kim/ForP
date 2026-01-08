// src/components/event/mbtiEvt.jsx
import { Box, Paper, Typography, Stack, Button } from '@mui/material';
import { useState } from 'react';
import { questions } from '../../../data/questions';
import { mbtiMap } from '../../../data/mbtiMap';

function MbtiEvt() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState([]);

  const handleSelect = (type) => {
    setResult((prev) => [...prev, type]);
    setStep((prev) => prev + 1);
  };

  const calculateMbti = () => {
    const count = { E:0, I:0, S:0, N:0, T:0, F:0, J:0, P:0 };
    result.forEach((r) => count[r]++);
    
    // 동점일 때 랜덤으로 결정하는 함수
    const getWinner = (a,b) =>{
        if(count[a] > count[b]) return a;
        if (count[b] > count[a]) return b;
        return Math.random() > 0.5 ? a : b;
    }

    return (
      getWinner('E','I') +
      getWinner('S','N') + 
      getWinner('T','F') + 
      getWinner('J','P')
    );
  };

  const isFinished = step >= questions.length;
  const mbti = isFinished ? calculateMbti() : null;

  return (
    <Box sx={{ maxWidth: 1180, mx: 'auto', py: 6 }}>
      <Typography fontWeight={700} sx={{ fontSize: 32, mb: 3 }}>
        이벤트
      </Typography>
      <Typography fontWeight={600} textAlign="center" sx={{ fontSize: 27, mb: 3 }}>
        MBTI로 알아보는<br />나와 닮은 반려동물
      </Typography>
      
      <Paper sx={{ p: 5, borderRadius: 8, textAlign: 'center' }}>
        {!isFinished ? (
          <>
            <Typography fontWeight={600} sx={{ fontSize: 24, mb: 4 }}>
              Q{step + 1}. {questions[step].question}
            </Typography>

            <Stack spacing={2}>
              {questions[step].options.map((opt, idx) => (
                <Button
                  key={idx}
                  variant="contained"
                  onClick={() => handleSelect(opt.type)}
                  sx={{
                    py: 2,
                    borderRadius: 3,
                    fontSize: '20px',
                    backgroundColor: '#C2E7FE',
                    color: '#000',
                    '&:hover': { backgroundColor: '#549BD3' },
                  }}
                >
                  {opt.text}
                </Button>
              ))}
            </Stack>
          </>
        ) : (
          <>
            <Typography fontWeight={700} sx={{ fontSize: 28, mb: 2 }}>
              당신의 MBTI는 {mbti}
            </Typography>
            <Typography sx={{ fontSize: '22px' }}>
              어울리는 반려동물은 <b>{mbtiMap[mbti]}</b> 입니다 🐾
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );
}

export default MbtiEvt;
