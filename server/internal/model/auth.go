package model

type RegisterRequest struct {
	Login    string `json:"login"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Login    string `json:"login"`
	Password string `json:"password"`
}

type AuthResponse struct {
	RefreshToken string          `json:"refresh_token"`
	AccessToken  string          `json:"access_token"`
	User         ProfileResponse `json:"user"`
}

type JwtClaims struct {
	Id    int64  `json:"id"`
	Login string `json:"login"`
}
