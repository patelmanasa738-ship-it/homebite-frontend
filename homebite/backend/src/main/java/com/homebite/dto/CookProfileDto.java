package com.homebite.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CookProfileDto {
    private Long id;
    private Long userId;
    private String cookName;
    private String kitchenName;
    private String bio;
    private String specialty;
    private String kitchenAddress;
    private Boolean isVerified;
    private BigDecimal ratingAvg;
    private Integer ratingCount;
    private String bannerUrl;
    private String avatarUrl;
    private LocalDateTime createdAt;

    public CookProfileDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getCookName() { return cookName; }
    public void setCookName(String cookName) { this.cookName = cookName; }

    public String getKitchenName() { return kitchenName; }
    public void setKitchenName(String kitchenName) { this.kitchenName = kitchenName; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }

    public String getKitchenAddress() { return kitchenAddress; }
    public void setKitchenAddress(String kitchenAddress) { this.kitchenAddress = kitchenAddress; }

    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }

    public BigDecimal getRatingAvg() { return ratingAvg; }
    public void setRatingAvg(BigDecimal ratingAvg) { this.ratingAvg = ratingAvg; }

    public Integer getRatingCount() { return ratingCount; }
    public void setRatingCount(Integer ratingCount) { this.ratingCount = ratingCount; }

    public String getBannerUrl() { return bannerUrl; }
    public void setBannerUrl(String bannerUrl) { this.bannerUrl = bannerUrl; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
