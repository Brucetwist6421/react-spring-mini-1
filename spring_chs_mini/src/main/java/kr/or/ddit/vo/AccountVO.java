package kr.or.ddit.vo;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountVO {

    // tb_account (계정 기본 정보)
    private Integer accSeq;       // 계정 일련번호 (serial)
    private Integer curSeq;       // 교육과정 일련번호 (fk)
    private String accountId;     // 아이디 (unique)
    private String accountName;   // 이름
    private LocalDate birth;      // 생년월일 (date)
    private String gender;        // 성별 (char(1))
    private String tel;           // 전화번호
    private String edu;           // 최종학력
    private String major;         // 전공
    private String gradType;      // 졸업구분
    private String career;        // 경력사항 (text)
    private String dropout_info;  // 중도탈락 정보 (text)
    private String status;        // 상태 (기본값: ENROLLED)
    private String accountEmail;  // 이메일 (unique)
    private String accountPasswd; // 비밀번호
    private String accountType;   // 계정타입 (기본값: STU)
    private String address;
    private String militaryStatus;
    
    private LocalDateTime regDate;    // 등록일시
    private String updateId;          // 수정자ID
    private LocalDateTime updateDate; // 수정일시

    // tb_curriculum (조인 정보)
    private String curName;
    private String businessName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String teacherSeq; // tb_curriculum의 account_seq (담당자)
    private String room;         // 교육실
    private String term;         // 교육기간

}