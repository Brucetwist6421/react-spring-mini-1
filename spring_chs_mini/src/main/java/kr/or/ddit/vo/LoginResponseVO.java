package kr.or.ddit.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Getter, Setter, ToString, EqualsAndHashCode 포함
@NoArgsConstructor // 마이바티스용 기본 생성자
@AllArgsConstructor // 전체 필드 생성자
public class LoginResponseVO {
    String accessToken;
    String email;
    String nickname;
    String type;
}
