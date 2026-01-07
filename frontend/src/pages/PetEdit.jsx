import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Card,
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
import { useParams } from "react-router-dom";
import { getPet, updatePet } from "../api/petsApi";

export default function PetEdit() {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const getPetImageUrl = (path) => {
        if (!path) return "";
        if (path.startsWith("blob:")) return path;
        return `${BASE_URL}${path}`;
    };

    const { petId } = useParams();
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        name: "",
        species: "",
        speciesEtc: "",
        breed: "",
        gender: "남",
        weight: "",
        imageFile: null,
        imagePreview: "",
        imageUrl: "",
    });

    useEffect(() => {
        const load = async () => {
            try {
                const pet = await getPet(petId);
                const knownSpecies = ["강아지", "고양이", "기타"];
                const isKnown = knownSpecies.includes(pet.species);

                setForm((prev) => ({
                    ...prev,
                    name: pet.name ?? "",
                    species: isKnown ? pet.species : "기타",
                    speciesEtc: isKnown ? "" : (pet.species ?? ""),
                    breed: pet.breed ?? "",
                    gender: pet.gender ?? "남",
                    weight: pet.weight ?? "",
                    imageUrl: pet.imageUrl ?? "",
                    imagePreview: pet.imageUrl ?? "",
                }));
            } catch (e) {
                alert(e?.response?.data?.message ?? "정보를 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [petId]);

    const speciesFinal = form.species === "기타" ? form.speciesEtc.trim() : form.species.trim();

    const canSubmit = useMemo(() => {
        return (
            form.name.trim() &&
            form.species.trim() &&
            (form.species !== "기타" || form.speciesEtc.trim()) &&
            form.gender &&
            String(form.weight).trim() &&
            (form.imageFile || form.imageUrl)
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
        const preview = URL.createObjectURL(file);
        setForm((prev) => ({ ...prev, imageFile: file, imagePreview: preview }));
    };

    const handleSubmit = async () => {
        if (!canSubmit) return;
        try {
            const payload = {
                name: form.name.trim(),
                species: speciesFinal,
                breed: form.breed.trim(),
                gender: form.gender,
                weight: Number(form.weight),
                imageUrl: form.imageUrl,
            };
            await updatePet({ petId, payload, imageFile: form.imageFile });
            alert("수정 완료!");
            window.close();
        } catch (e) {
            alert(e?.response?.data?.message ?? "수정 실패");
        }
    };

    if (loading) return <Box sx={{ height: "100vh", bgcolor: "#EEF6FF" }} />;

    return (
        <Box
            sx={{
                height: "100vh",
                width: "100vw",
                bgcolor: "#EEF6FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden", // 전체 스크롤 방지
                position: "fixed",
                top: 0,
                left: 0
            }}
        >
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <Typography sx={{ fontSize: 44, fontWeight: 900, textAlign: "center", mb: 4 }}>
                    반려동물 수정
                </Typography>

                <Card sx={{ borderRadius: 6, p: 5, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
                    <Box sx={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 5, alignItems: "start" }}>
                        <Box>
                            <Box sx={{ width: 420, height: 300, borderRadius: 4, bgcolor: "#E7F2FF", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {form.imagePreview ? (
                                    <Box component="img" src={getPetImageUrl(form.imagePreview)} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <Typography sx={{ color: "text.secondary" }}>이미지 없음</Typography>
                                )}
                            </Box>
                            <Button component="label" variant="outlined" sx={{ mt: 2, borderRadius: 999, width: 420, height: 48, fontWeight: 800 }}>
                                사진 변경
                                <input hidden type="file" accept="image/jpeg,image/png" onChange={onPickImage} />
                            </Button>
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <TextField label="이름" value={form.name} onChange={onChange("name")} />
                            <FormControl>
                                <InputLabel>종</InputLabel>
                                <Select label="종" value={form.species} onChange={onChange("species")}>
                                    <MenuItem value={"강아지"}>강아지</MenuItem>
                                    <MenuItem value={"고양이"}>고양이</MenuItem>
                                    <MenuItem value={"기타"}>기타</MenuItem>
                                </Select>
                            </FormControl>
                            {form.species === "기타" && <TextField label="종(기타)" value={form.speciesEtc} onChange={onChange("speciesEtc")} />}
                            <TextField label="품종" value={form.breed} onChange={onChange("breed")} />
                            <Box>
                                <Typography sx={{ fontWeight: 900, mb: 1 }}>성별</Typography>
                                <RadioGroup row value={form.gender} onChange={onChange("gender")}>
                                    <FormControlLabel value="남" control={<Radio />} label="남아" />
                                    <FormControlLabel value="여" control={<Radio />} label="여아" />
                                    <FormControlLabel value="중성" control={<Radio />} label="중성" />
                                    <FormControlLabel value="없음" control={<Radio />} label="없음" />
                                </RadioGroup>
                            </Box>
                            <TextField label="몸무게(kg)" value={form.weight} onChange={onChange("weight")} type="number" />
                        </Box>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 6 }}>
                        <Button variant="contained" disabled={!canSubmit} onClick={handleSubmit} sx={{ width: 220, height: 52, borderRadius: 999, bgcolor: "#BFE0FF", color: "#1A1A1A", fontWeight: 900 }}>
                            수정
                        </Button>
                        <Button variant="outlined" onClick={() => window.close()} sx={{ width: 220, height: 52, borderRadius: 999, fontWeight: 900 }}>
                            취소
                        </Button>
                    </Box>
                </Card>
            </Box>
        </Box>
    );
}