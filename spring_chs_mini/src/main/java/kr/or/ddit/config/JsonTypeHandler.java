package kr.or.ddit.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import kr.or.ddit.vo.LmsDashboardVO.SubjectStatVO; // VO 경로에 맞게 수정하세요
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

import java.sql.*;
import java.util.List;

/**
 * PostgreSQL의 JSONB 타입을 Java의 List<SubjectStatVO>로 변환하는 핸들러
 */
public class JsonTypeHandler extends BaseTypeHandler<List<SubjectStatVO>> {
    
    // 재사용을 위해 static으로 선언
    private static final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, List<SubjectStatVO> parameter, JdbcType jdbcType) throws SQLException {
        // PostgreSQL에서 JSON 데이터를 보낼 때 Types.OTHER를 사용합니다.
        try {
            ps.setObject(i, mapper.writeValueAsString(parameter), Types.OTHER);
        } catch (JsonProcessingException e) {
            throw new SQLException("JSON write error: " + e.getMessage());
        }
    }

    @Override
    public List<SubjectStatVO> getNullableResult(ResultSet rs, String columnName) throws SQLException {
        return toList(rs.getString(columnName));
    }

    @Override
    public List<SubjectStatVO> getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        return toList(rs.getString(columnIndex));
    }

    @Override
    public List<SubjectStatVO> getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        return toList(cs.getString(columnIndex));
    }

    private List<SubjectStatVO> toList(String content) {
        if (content == null || content.isEmpty()) {
            return null;
        }
        try {
            // JSON 문자열을 List<SubjectStatVO> 객체로 변환
            return mapper.readValue(content, new TypeReference<List<SubjectStatVO>>() {});
        } catch (Exception e) {
            // 로그를 남기거나 적절한 예외 처리를 권장합니다.
            return null;
        }
    }
}