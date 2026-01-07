import React, { useMemo, useState } from "react";
import {
    Box,
    Button,
    Card,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
} from "@mui/material";
import { registerPet } from "../api/petsApi";

export default function PetRegister() {
    const [form, setForm] = useState({
        name: "",
        species: "",
        speciesEtc: "",
        breed: "",
        gender: "남",
        weight: "",
        imageFile: null,
        imagePreview: "",
    });

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const getPetImageUrl = (path) => {
        if (!path) return "";
        if (path.startsWith("blob:")) return path;
        return `${BASE_URL}${path}`;
    };

    const speciesFinal =
        form.species === "기타" ? form.speciesEtc.trim() : form.species.trim();

    const canSubmit = useMemo(() => {
        return (
            form.name.trim() &&
            form.species.trim() &&
            (form.species !== "기타" || form.speciesEtc.trim()) &&
            form.gender &&
            String(form.weight).trim() &&
            form.imageFile
        );
    }, [form]);

    const onChange = (key) => (e) => {
        let value = e.target.value;
        if (key === "weight") {
            value = value.replace(/[^0-9.]/g, "");
            const parts = value.split(".");
            if (parts.length > 2) return;
            if (parts[1] && parts[1].length > 2) {
                value = `${parts[0]}.${parts[1].slice(0, 2)}`;
            }
            if (Number(value) > 99.99) value = "99.99";
        }
        setForm((prev) => ({
            ...prev,
            [key]: value,
            ...(key === "species" && value !== "기타" ? { speciesEtc: "" } : null),
        }));
    };

    const onPickImage = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowed = ["image/jpeg", "image/png"];
        if (!allowed.includes(file.type)) {
            alert("jpg, jpeg, png만 업로드 가능합니다.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("최대 5MB까지 업로드 가능합니다.");
            return;
        }

        const preview = URL.createObjectURL(file);
        setForm((prev) => ({ ...prev, imageFile: file, imagePreview: preview }));
    };

    const handleSubmit = async () => {
        if (!canSubmit) return;
        if (Number(form.weight) < 0.1) {
            alert("몸무게는 최소 0.1kg 이상이어야 합니다.");
            return;
        }

        try {
            const payload = {
                name: form.name.trim(),
                species: speciesFinal,
                breed: form.breed.trim(),
                gender: form.gender,
                weight: Number(form.weight),
            };

            await registerPet({
                payload,
                imageFile: form.imageFile,
            });

            alert("등록 완료!");
            window.close();
        } catch (e) {
            alert(e?.response?.data?.message ?? "등록 실패");
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#EEF6FF", py: 6 }}>
            <Container maxWidth={false} sx={{ width: 1100 }}>
                <Typography sx={{ fontSize: 44, fontWeight: 900, textAlign: "center", mb: 4 }}>
                    반려동물 등록
                </Typography>

                <Card sx={{ borderRadius: 6, p: 5, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
                    <Box sx={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 5, alignItems: "start" }}>
                        {/* 이미지 */}
                        <Box>
                            <Box
                                sx={{
                                    width: 420,
                                    height: 300,
                                    borderRadius: 4,
                                    bgcolor: "#E7F2FF",
                                    overflow: "hidden",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                                }}
                            >
                                {form.imagePreview ? (
                                    <Box
                                        component="img"
                                        src={getPetImageUrl(form.imagePreview)}
                                        alt="preview"
                                        sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <Typography sx={{ color: "text.secondary" }}>
                                        280x300 비율 권장
                                    </Typography>
                                )}
                            </Box>

                            <Button component="label" variant="outlined" sx={{ mt: 2, borderRadius: 999, width: 420, height: 48, fontWeight: 800 }}>
                                사진 선택
                                <input hidden type="file" accept="image/jpeg,image/png" onChange={onPickImage} />
                            </Button>

                            <Typography sx={{ mt: 1, color: "text.secondary", fontSize: 13, }}>
                                jpg/jpeg/png, 최대 5MB
                            </Typography>
                        </Box>

                        {/* 폼 */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <TextField label="이름" value={form.name} onChange={onChange("name")} inputProps={{ maxLength: 10 }} />

                            <FormControl>
                                <InputLabel id="species-label">종</InputLabel>
                                <Select labelId="species-label" label="종" value={form.species} onChange={onChange("species")}>
                                    <MenuItem value={"강아지"}>강아지</MenuItem>
                                    <MenuItem value={"고양이"}>고양이</MenuItem>
                                    <MenuItem value={"기타"}>기타</MenuItem>
                                </Select>
                            </FormControl>

                            {/* 종이 기타면 입력창 표시 */}
                            {form.species === "기타" && (
                                <TextField
                                    label="종(기타)"
                                    placeholder="예: 토끼, 햄스터..."
                                    value={form.speciesEtc}
                                    onChange={onChange("speciesEtc")}
                                    inputProps={{ maxLength: 20 }}
                                />
                            )}

                            <TextField
                                label="품종"
                                placeholder="품종을 입력하세요"
                                value={form.breed}
                                onChange={onChange("breed")}
                                inputProps={{ maxLength: 10 }}
                            />

                            <Box>
                                <Typography sx={{ fontWeight: 900, mb: 1 }}>성별</Typography>
                                <RadioGroup row value={form.gender} onChange={onChange("gender")}>
                                    <FormControlLabel value="남" control={<Radio />} label="남아" />
                                    <FormControlLabel value="여" control={<Radio />} label="여아" />
                                    <FormControlLabel value="중성" control={<Radio />} label="중성" />
                                    <FormControlLabel value="없음" control={<Radio />} label="없음" />
                                </RadioGroup>
                            </Box>

                            <TextField
                                label="몸무게(kg)"
                                value={form.weight}
                                onChange={onChange("weight")}
                                type="number"
                                inputProps={{ step: "0.1", min: "0.1", max: "99.99" }}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 6 }}>
                        <Button
                            variant="contained"
                            disabled={!canSubmit}
                            onClick={handleSubmit}
                            sx={{
                                width: 220,
                                height: 52,
                                borderRadius: 999,
                                bgcolor: "#BFE0FF",
                                color: "#1A1A1A",
                                fontWeight: 900,
                                "&:hover": { bgcolor: "#A9D6FF" },
                            }}
                        >
                            등록
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={() => window.close()}
                            sx={{ width: 220, height: 52, borderRadius: 999, fontWeight: 900 }}
                        >
                            취소
                        </Button>
                    </Box>
                </Card>
            </Container>
        </Box>
    );
}
