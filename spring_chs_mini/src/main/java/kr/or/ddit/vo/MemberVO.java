package kr.or.ddit.vo;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Getter, Setter, ToString, EqualsAndHashCode 포함
@NoArgsConstructor // 마이바티스용 기본 생성자
@AllArgsConstructor // 전체 필드 생성자
public class MemberVO {
    private Long memNo;        // MEMBER_NO AS memNo
    private String email;      // MEMBER_EMAIL AS email
    private String password;   // MEMBER_PASS AS password
    private String nickname;   // MEMBER_NICKNAME AS nickname
    private String memType;    // MEMBER_TYPE AS memType (권한 구분용)
    private Date regDate;    // REG_DATE AS regDate
    private String updateId;   // UPDATE_ID AS updateId
    private Date updateDate;   // UPDATE_DATE AS updateDate
}
