package kr.or.ddit.vo;


import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Getter, Setter, ToString, EqualsAndHashCode 포함
@NoArgsConstructor // 마이바티스용 기본 생성자
@AllArgsConstructor // 전체 필드 생성자
@Builder // 빌더 패턴 지원
public class LoginResponseVO {
    String accessToken;
    String accId;
    String accEmail;
    String accName;
    String accType;
    String mainImagePath;
}
