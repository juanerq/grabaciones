export const queryGetRecordingName = ({ year, month, day }) => {
  const date = `${year}-${month}-${day}}`

  return `
    SELECT *
    FROM cbpo_davivienda_wiser.gestiones g
    LEFT JOIN cbpo_davivienda_wiser.recording r
      ON TRIM(g.telefono) = TRIM(r.phone_number)
      AND g.gestion_fecha BETWEEN (r.call_date - INTERVAL '20 minutes') AND (r.call_date + INTERVAL '20 minutes')
    WHERE g.id_tipificacion IN (
      SELECT t.id
      FROM cbpo_davivienda_wiser.tipificaciones t
      LEFT JOIN public.indicadores_general ig
        ON t.indicador = ig.id
      WHERE t.status IS TRUE
        AND t.unidad = 12
        AND ig.indicador_contacto = 1)
    AND DATE_TRUNC('month', g.gestion_fecha) = '${date}'
    ORDER BY g.gestion_fecha ASC
  `
}