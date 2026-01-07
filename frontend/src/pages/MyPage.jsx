import {
    Box,
    Button,
    Card,
    Container,
    Divider,
    Grid,
    IconButton,
    Typography,
    Avatar,
    Stack,
    TextField,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { getMyPageMe, updateNickname, updateProfileImage } from "../api/mypageApi";
import { getMyPets, deletePet } from "../api/petsApi";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import defaultProfile from "../assets/images/defaultImage.png";

function MyPage() {
    const [user, setUser] = useState(() => {
        const u = JSON.parse(localStorage.getItem("loginUser"));
        return u ?? { nickname: "", rgstDate: "", profileImage: "" };
    });

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const getFullProfileImage = (url) => {
        if (!url || url.trim() === "") return defaultProfile; // 기본 이미지 반환
        if (url.startsWith("http")) return url;
        return `${BASE_URL}${url}`;
    };

    const formatDate = (value) => {
        if (!value) return "";
        const d = new Date(value);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}.${mm}.${dd}`;
    };

    useEffect(() => {
        const loadMe = async () => {
            try {
                const me = await getMyPageMe();
                setUser((prev) => ({ ...prev, ...me }));
                const prevLocal = JSON.parse(localStorage.getItem("loginUser")) ?? {};
                localStorage.setItem("loginUser", JSON.stringify({ ...prevLocal, ...me }));
            } catch (e) {
                console.log(e);
            }
        };
        loadMe();
    }, []);

    const profileInputRef = useRef(null);
    const [uploadingProfile, setUploadingProfile] = useState(false);
    const [isEditingNickname, setIsEditingNickname] = useState(false);
    const [nicknameInput, setNicknameInput] = useState(user.nickname ?? "");

    const nicknameRegex = useMemo(() => /^[A-Za-z0-9가-힣]{2,20}$/, []);
    const nicknameTrimmed = nicknameInput.trim();
    const isNicknameValid = nicknameTrimmed.length === 0 ? false : nicknameRegex.test(nicknameTrimmed);
    const nicknameHelper = "닉네임은 2~20자 이내의 한글, 영문, 숫자만 사용할 수 있습니다.";

    const handlePickProfile = () => {
        if (uploadingProfile) return;
        profileInputRef.current?.click();
    };

    const handleProfileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        e.target.value = "";
        const allowed = ["image/jpeg", "image/png", "image/webp"];
        if (!allowed.includes(file.type)) {
            alert("jpg, png, webp 이미지만 가능합니다.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("5MB 이하 이미지만 가능합니다.");
            return;
        }

        try {
            setUploadingProfile(true);
            const updated = await updateProfileImage(file);
            setUser((prev) => ({ ...prev, ...updated }));
            const prevLocal = JSON.parse(localStorage.getItem("loginUser")) ?? {};
            localStorage.setItem("loginUser", JSON.stringify({ ...prevLocal, ...updated }));
        } catch (err) {
            alert(err?.response?.data?.message ?? "프로필 이미지 변경 실패");
        } finally {
            setUploadingProfile(false);
        }
    };

    const startEditNickname = () => {
        setNicknameInput(user.nickname ?? "");
        setIsEditingNickname(true);
    };

    const cancelEditNickname = () => {
        setNicknameInput(user.nickname ?? "");
        setIsEditingNickname(false);
    };

    const saveNickname = async () => {
        if (!isNicknameValid) return;
        try {
            const updated = await updateNickname(nicknameTrimmed);
            setUser((prev) => ({ ...prev, ...updated }));
            const prevLocal = JSON.parse(localStorage.getItem("loginUser")) ?? {};
            localStorage.setItem("loginUser", JSON.stringify({ ...prevLocal, ...updated }));
            setIsEditingNickname(false);
        } catch (e) {
            alert(e?.response?.data?.message ?? "닉네임 변경 실패");
        }
    };

    const [pets, setPets] = useState([]);

    useEffect(() => {
        const loadPets = async () => {
            try {
                const list = await getMyPets();
                setPets(list);
            } catch (e) {
                console.log(e);
            }
        };
        loadPets();
    }, []);

    const openPetRegister = () => {
        const width = 1100;
        const height = 850;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const options = `width=${width},height=${height},left=${left},top=${top},scrollbars=no,resizable=no`;
        const w = window.open("/pet-register", "_blank", options);

        const timer = setInterval(async () => {
            if (!w || w.closed) {
                clearInterval(timer);
                try {
                    const list = await getMyPets();
                    setPets(list);
                } catch (e) { console.log(e); }
            }
        }, 500);
    };

    const openPetEdit = (petId) => {
        const width = 1100;
        const height = 850;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const options = `width=${width},height=${height},left=${left},top=${top},scrollbars=no,resizable=no`;
        const w = window.open(`/pet-edit/${petId}`, "_blank", options);

        const timer = setInterval(async () => {
            if (!w || w.closed) {
                clearInterval(timer);
                try {
                    const list = await getMyPets();
                    setPets(list);
                } catch (e) { console.log(e); }
            }
        }, 500);
    };

    return (
        <Stack>
            <Box>
                <Container maxWidth={false} sx={{ width: 1450, py: 5, margin: "0 auto" }}>
                    <Typography sx={{ fontSize: 32, fontWeight: 800, mb: 3 }}>
                        마이페이지
                    </Typography>

                    <Grid container spacing={4}>
                        {/* 왼쪽: 내 정보 */}
                        <Grid item sx={{ width: 650 }}>
                            <Card sx={{ borderRadius: 6, p: 4, minHeight: 640, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
                                <Typography sx={{ fontSize: 28, fontWeight: 900, mb: 2 }}>내 정보</Typography>
                                <Divider sx={{ mb: 4, borderColor: "#4DA3FF" }} />

                                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                                    <Box sx={{ position: "relative" }}>
                                        <Avatar
                                            src={getFullProfileImage(user.profileImage)}
                                            alt="profile"
                                            sx={{
                                                width: 220,
                                                height: 220,
                                                boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
                                                opacity: uploadingProfile ? 0.6 : 1,
                                            }}
                                        />
                                        <IconButton
                                            sx={{
                                                position: "absolute",
                                                right: 12, bottom: 12,
                                                bgcolor: "white",
                                                boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
                                                "&:hover": { bgcolor: "#F4FAFF" },
                                                width: 56, height: 56,
                                            }}
                                            onClick={handlePickProfile}
                                            disabled={uploadingProfile}
                                        >
                                            <PhotoCameraIcon />
                                        </IconButton>
                                        <input
                                            ref={profileInputRef}
                                            type="file"
                                            accept="image/*"
                                            style={{ display: "none" }}
                                            onChange={handleProfileChange}
                                        />
                                    </Box>
                                </Box>

                                <Box sx={{ textAlign: "center", mt: 3 }}>
                                    {!isEditingNickname ? (
                                        <>
                                            <Typography sx={{ fontSize: 28, fontWeight: 900 }}>{user.nickname}</Typography>
                                            <Typography sx={{ color: "text.secondary", mt: 1 }}>
                                                가입일: {formatDate(user.rgstDate)}
                                            </Typography>
                                            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                                                <Button
                                                    onClick={startEditNickname}
                                                    variant="contained"
                                                    sx={{
                                                        width: 360, height: 56, borderRadius: 999,
                                                        bgcolor: "#CFE9FF", color: "#1A1A1A", fontWeight: 800,
                                                        boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
                                                        "&:hover": { bgcolor: "#BFE0FF" },
                                                    }}
                                                >
                                                    닉네임 수정
                                                </Button>
                                            </Box>
                                        </>
                                    ) : (
                                        <>
                                            <Typography sx={{ fontSize: 24, fontWeight: 900, mb: 2 }}>{user.nickname}</Typography>
                                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                                <Box sx={{ width: 520, maxWidth: "100%" }}>
                                                    <TextField
                                                        fullWidth
                                                        value={nicknameInput}
                                                        onChange={(e) => {
                                                            const next = e.target.value;
                                                            if (next.length <= 20) setNicknameInput(next);
                                                        }}
                                                        placeholder="닉네임을 입력하세요"
                                                        error={nicknameTrimmed.length > 0 && !isNicknameValid}
                                                        helperText={nicknameHelper}
                                                        sx={{ mt: 1, "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "white" } }}
                                                    />
                                                    <Typography sx={{ textAlign: "right", color: "text.secondary", mt: 0.5, fontSize: 13 }}>
                                                        {nicknameInput.length}/20
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
                                                <Button
                                                    onClick={saveNickname}
                                                    disabled={!isNicknameValid}
                                                    variant="contained"
                                                    sx={{
                                                        width: 180, height: 56, borderRadius: 999,
                                                        bgcolor: "#CFE9FF", color: "#1A1A1A", fontWeight: 900,
                                                        "&:hover": { bgcolor: "#BFE0FF" },
                                                    }}
                                                >
                                                    수정
                                                </Button>
                                                <Button
                                                    onClick={cancelEditNickname}
                                                    variant="contained"
                                                    sx={{
                                                        width: 180, height: 56, borderRadius: 999,
                                                        bgcolor: "#E5EEF7", color: "#1A1A1A", fontWeight: 900,
                                                    }}
                                                >
                                                    취소
                                                </Button>
                                            </Box>
                                        </>
                                    )}
                                </Box>
                            </Card>
                        </Grid>

                        {/* 오른쪽: 내 동물 정보 */}
                        <Grid item sx={{ width: 600 }}>
                            <Card sx={{ borderRadius: 6, p: 4, minHeight: 640, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
                                <Typography sx={{ fontSize: 28, fontWeight: 900, mb: 2 }}>내 동물 정보</Typography>
                                <Divider sx={{ mb: 4, borderColor: "#4DA3FF" }} />
                                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, mt: 2 }}>
                                    {pets.map((pet) => (
                                        <Card key={pet.petId} sx={{ borderRadius: 4, overflow: "hidden", p: 0 }}>
                                            <Box
                                                component="img"
                                                src={getFullProfileImage(pet.imageUrl)}
                                                alt={pet.name}
                                                sx={{ width: "100%", height: 220, objectFit: "cover" }}
                                            />
                                            <Box sx={{ p: 2 }}>
                                                <Typography sx={{ fontSize: 22, fontWeight: 900 }}>{pet.name}</Typography>
                                                <Typography sx={{ color: "text.secondary", mt: 0.5 }}>
                                                    {pet.species} · {pet.breed || "품종 없음"} · {pet.gender}
                                                </Typography>
                                                <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        sx={{ bgcolor: "#CFE9FF", color: "#1A1A1A", fontWeight: 900 }}
                                                        onClick={() => openPetEdit(pet.petId)}
                                                    >
                                                        수정
                                                    </Button>
                                                    <Button
                                                        fullWidth
                                                        variant="outlined"
                                                        sx={{ fontWeight: 900 }}
                                                        onClick={async () => {
                                                            if (!confirm("삭제할까요?")) return;
                                                            await deletePet(pet.petId);
                                                            setPets((prev) => prev.filter((p) => p.petId !== pet.petId));
                                                        }}
                                                    >
                                                        삭제
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Card>
                                    ))}
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                                    <Button
                                        onClick={openPetRegister}
                                        variant="contained"
                                        sx={{
                                            width: "90%", height: 64, borderRadius: 999,
                                            bgcolor: "#CFE9FF", color: "#1A1A1A", fontWeight: 900, fontSize: 18,
                                            boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
                                            "&:hover": { bgcolor: "#BFE0FF" },
                                        }}
                                    >
                                        + 반려동물 등록
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Stack>
    );
}

export default MyPage;