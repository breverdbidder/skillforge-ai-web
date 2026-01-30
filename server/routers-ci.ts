/**
 * Competitive Intelligence API Routes
 * Local data access for Competitor Analyzer skill
 */
import type { Express, Request, Response } from "express";
import { getDb } from "./db";
import { sql } from "drizzle-orm";

export function registerCIRoutes(app: Express) {
  
  // ============================================================================
  // COMPETITOR ENDPOINTS
  // ============================================================================
  
  /**
   * GET /api/ci/competitors
   * Get all competitors with optional category filter
   */
  app.get("/api/ci/competitors", async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      if (!db) {
        return res.status(503).json({ success: false, error: "Database not available" });
      }
      
      const { category } = req.query;
      
      let result;
      if (category) {
        result = await db.execute(
          sql`SELECT * FROM ci_competitors WHERE category = ${category} ORDER BY name`
        );
      } else {
        result = await db.execute(
          sql`SELECT * FROM ci_competitors ORDER BY category, name`
        );
      }
      
      res.json({
        success: true,
        data: result,
        count: result.length
      });
    } catch (error) {
      console.error("Error fetching competitors:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch competitors" 
      });
    }
  });
  
  /**
   * GET /api/ci/competitors/:id
   * Get single competitor with full details
   */
  app.get("/api/ci/competitors/:id", async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      if (!db) {
        return res.status(503).json({ success: false, error: "Database not available" });
      }
      
      const { id } = req.params;
      
      const result = await db.execute(
        sql`SELECT * FROM ci_competitors WHERE id = ${id}`
      );
      
      if (result.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: "Competitor not found" 
        });
      }
      
      // Get latest analysis if exists
      const analysisResult = await db.execute(
        sql`SELECT * FROM ci_analyses 
            WHERE competitor_id = ${id} 
            ORDER BY created_at DESC 
            LIMIT 1`
      );
      
      res.json({
        success: true,
        data: {
          ...result[0],
          latest_analysis: analysisResult[0] || null
        }
      });
    } catch (error) {
      console.error("Error fetching competitor:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch competitor" 
      });
    }
  });
  
  /**
   * POST /api/ci/competitors
   * Add new competitor
   */
  app.post("/api/ci/competitors", async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      if (!db) {
        return res.status(503).json({ success: false, error: "Database not available" });
      }
      
      const { id, name, domain, category, description, known_features, pricing, video_sources } = req.body;
      
      if (!id || !name || !category) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: id, name, category"
        });
      }
      
      await db.execute(sql`
        INSERT INTO ci_competitors (
          id, name, domain, category, description,
          known_features, pricing, video_sources
        ) VALUES (
          ${id}, ${name}, ${domain || null}, ${category}, ${description || null},
          ${JSON.stringify(known_features || [])},
          ${JSON.stringify(pricing || {})},
          ${JSON.stringify(video_sources || [])}
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          domain = EXCLUDED.domain,
          category = EXCLUDED.category,
          description = EXCLUDED.description,
          known_features = EXCLUDED.known_features,
          pricing = EXCLUDED.pricing,
          video_sources = EXCLUDED.video_sources,
          updated_at = NOW()
      `);
      
      res.json({ success: true, message: "Competitor added/updated" });
    } catch (error) {
      console.error("Error adding competitor:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to add competitor" 
      });
    }
  });
  
  // ============================================================================
  // FEATURE MATRIX ENDPOINTS
  // ============================================================================
  
  /**
   * GET /api/ci/feature-matrix
   * Get full feature comparison matrix
   */
  app.get("/api/ci/feature-matrix", async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      if (!db) {
        return res.status(503).json({ success: false, error: "Database not available" });
      }
      
      const { category } = req.query;
      
      let result;
      if (category) {
        result = await db.execute(
          sql`SELECT * FROM ci_feature_matrix 
              WHERE feature_category = ${category}
              ORDER BY priority DESC, feature_name`
        );
      } else {
        result = await db.execute(
          sql`SELECT * FROM ci_feature_matrix 
              ORDER BY feature_category, priority DESC, feature_name`
        );
      }
      
      // Transform to matrix format
      const matrix: Record<string, any[]> = {};
      for (const row of result) {
        const cat = row.feature_category as string;
        if (!matrix[cat]) matrix[cat] = [];
        matrix[cat].push(row);
      }
      
      res.json({
        success: true,
        data: matrix,
        flat: result,
        count: result.length
      });
    } catch (error) {
      console.error("Error fetching feature matrix:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch feature matrix" 
      });
    }
  });
  
  // ============================================================================
  // ANALYSIS ENDPOINTS
  // ============================================================================
  
  /**
   * GET /api/ci/analyses
   * Get recent analyses
   */
  app.get("/api/ci/analyses", async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      if (!db) {
        return res.status(503).json({ success: false, error: "Database not available" });
      }
      
      const { competitor_id, limit = "10" } = req.query;
      const limitNum = parseInt(limit as string) || 10;
      
      let result;
      if (competitor_id) {
        result = await db.execute(sql`
          SELECT a.*, c.name as competitor_name, c.domain as competitor_domain
          FROM ci_analyses a
          JOIN ci_competitors c ON a.competitor_id = c.id
          WHERE a.competitor_id = ${competitor_id}
          ORDER BY a.created_at DESC
          LIMIT ${limitNum}
        `);
      } else {
        result = await db.execute(sql`
          SELECT a.*, c.name as competitor_name, c.domain as competitor_domain
          FROM ci_analyses a
          JOIN ci_competitors c ON a.competitor_id = c.id
          ORDER BY a.created_at DESC
          LIMIT ${limitNum}
        `);
      }
      
      res.json({
        success: true,
        data: result,
        count: result.length
      });
    } catch (error) {
      console.error("Error fetching analyses:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch analyses" 
      });
    }
  });
  
  /**
   * POST /api/ci/analyses
   * Store new analysis result
   */
  app.post("/api/ci/analyses", async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      if (!db) {
        return res.status(503).json({ success: false, error: "Database not available" });
      }
      
      const { 
        competitor_id, 
        analysis_type,
        features,
        ui_patterns,
        pricing_signals,
        marketing_claims,
        technical_stack,
        screenshots,
        raw_content,
        analysis_score
      } = req.body;
      
      if (!competitor_id) {
        return res.status(400).json({
          success: false,
          error: "Missing required field: competitor_id"
        });
      }
      
      const result = await db.execute(sql`
        INSERT INTO ci_analyses (
          competitor_id, analysis_type, features, ui_patterns,
          pricing_signals, marketing_claims, technical_stack,
          screenshots, raw_content, analysis_score
        ) VALUES (
          ${competitor_id},
          ${analysis_type || 'full'},
          ${JSON.stringify(features || [])},
          ${JSON.stringify(ui_patterns || [])},
          ${JSON.stringify(pricing_signals || [])},
          ${JSON.stringify(marketing_claims || [])},
          ${JSON.stringify(technical_stack || {})},
          ${JSON.stringify(screenshots || [])},
          ${raw_content || ''},
          ${analysis_score || 0}
        )
        RETURNING id
      `);
      
      // Update competitor's last_analyzed
      await db.execute(sql`
        UPDATE ci_competitors 
        SET last_analyzed = NOW(), updated_at = NOW()
        WHERE id = ${competitor_id}
      `);
      
      res.json({ 
        success: true, 
        data: { id: result[0]?.id },
        message: "Analysis stored" 
      });
    } catch (error) {
      console.error("Error storing analysis:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to store analysis" 
      });
    }
  });
  
  // ============================================================================
  // SUMMARY ENDPOINTS
  // ============================================================================
  
  /**
   * GET /api/ci/summary
   * Get CI dashboard summary
   */
  app.get("/api/ci/summary", async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      if (!db) {
        return res.status(503).json({ success: false, error: "Database not available" });
      }
      
      const stats = await db.execute(sql`
        SELECT 
          (SELECT COUNT(*) FROM ci_competitors) as total_competitors,
          (SELECT COUNT(*) FROM ci_competitors WHERE category = 'direct') as direct,
          (SELECT COUNT(*) FROM ci_competitors WHERE category = 'adjacent') as adjacent,
          (SELECT COUNT(*) FROM ci_competitors WHERE category = 'aspirational') as aspirational,
          (SELECT COUNT(*) FROM ci_feature_matrix) as total_features,
          (SELECT COUNT(*) FROM ci_feature_matrix WHERE biddeed_status = 'available') as biddeed_features,
          (SELECT COUNT(*) FROM ci_analyses) as total_analyses
      `);
      
      const recentCompetitors = await db.execute(sql`
        SELECT id, name, category, last_analyzed
        FROM ci_competitors
        ORDER BY last_analyzed DESC NULLS LAST
        LIMIT 5
      `);
      
      res.json({
        success: true,
        data: {
          stats: stats[0],
          recent_competitors: recentCompetitors
        }
      });
    } catch (error) {
      console.error("Error fetching summary:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch summary" 
      });
    }
  });
  
  /**
   * GET /api/ci/health
   * Health check for CI module
   */
  app.get("/api/ci/health", async (_req: Request, res: Response) => {
    try {
      const db = await getDb();
      
      if (!db) {
        return res.json({
          success: true,
          status: 'database_unavailable',
          tables: {
            ci_competitors: false,
            ci_feature_matrix: false,
            ci_analyses: false
          },
          timestamp: new Date().toISOString()
        });
      }
      
      // Check if tables exist by trying to count
      let hasCompetitors = false;
      let hasMatrix = false;
      let hasAnalyses = false;
      
      try {
        const c = await db.execute(sql`SELECT COUNT(*) as count FROM ci_competitors`);
        hasCompetitors = true;
      } catch (e) { /* table doesn't exist */ }
      
      try {
        const m = await db.execute(sql`SELECT COUNT(*) as count FROM ci_feature_matrix`);
        hasMatrix = true;
      } catch (e) { /* table doesn't exist */ }
      
      try {
        const a = await db.execute(sql`SELECT COUNT(*) as count FROM ci_analyses`);
        hasAnalyses = true;
      } catch (e) { /* table doesn't exist */ }
      
      const allTablesExist = hasCompetitors && hasMatrix && hasAnalyses;
      
      res.json({
        success: true,
        status: allTablesExist ? 'healthy' : 'tables_missing',
        tables: {
          ci_competitors: hasCompetitors,
          ci_feature_matrix: hasMatrix,
          ci_analyses: hasAnalyses
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error in health check:", error);
      res.status(500).json({ 
        success: false, 
        status: 'error',
        error: "Health check failed" 
      });
    }
  });
  
  console.log('📊 Competitive Intelligence routes registered');
}
